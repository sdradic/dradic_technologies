"""Add gym_tracker tables

Revision ID: b11314634d95
Revises: add_user_roles_many_groups
Create Date: 2026-01-06 22:15:33.297441

"""
from alembic import op
from sqlalchemy.dialects.postgresql import JSONB, UUID
from typing import Sequence, Union

# revision identifiers, used by Alembic.
revision: str = 'b11314634d95'
down_revision: Union[str, None] = 'add_user_roles_many_groups'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    # Create exercises table
    op.execute("""
        CREATE TABLE IF NOT EXISTS dradic_tech.exercises (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            name VARCHAR NOT NULL UNIQUE,
            muscles_trained JSONB NOT NULL,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
    """)

    # Create gym_activity table
    op.execute("""
        CREATE TABLE IF NOT EXISTS dradic_tech.gym_activity (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            user_id VARCHAR NOT NULL REFERENCES dradic_tech.users(id) ON DELETE CASCADE,
            exercise_id UUID NOT NULL REFERENCES dradic_tech.exercises(id) ON DELETE CASCADE,
            sets INTEGER NOT NULL,
            reps INTEGER NOT NULL,
            weight FLOAT,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
    """)

    # Create indexes for better performance
    op.execute("""
        CREATE INDEX IF NOT EXISTS ix_dradic_tech_gym_activity_user_id
        ON dradic_tech.gym_activity (user_id);
    """)

    op.execute("""
        CREATE INDEX IF NOT EXISTS ix_dradic_tech_gym_activity_exercise_id
        ON dradic_tech.gym_activity (exercise_id);
    """)

    op.execute("""
        CREATE INDEX IF NOT EXISTS ix_dradic_tech_gym_activity_created_at
        ON dradic_tech.gym_activity (created_at);
    """)

    # Enable Row Level Security
    op.execute("""
        ALTER TABLE dradic_tech.exercises ENABLE ROW LEVEL SECURITY;
    """)

    op.execute("""
        ALTER TABLE dradic_tech.gym_activity ENABLE ROW LEVEL SECURITY;
    """)

    # Create RLS policies for exercises (public read, admin write)
    op.execute("""
        CREATE POLICY "Anyone can view exercises" ON dradic_tech.exercises
        FOR SELECT USING (true);
    """)

    op.execute("""
        CREATE POLICY "Admins can manage exercises" ON dradic_tech.exercises
        FOR ALL USING (
            EXISTS (
                SELECT 1 FROM dradic_tech.users
                WHERE id = auth.uid()::text AND role = 'admin'
            )
        );
    """)

    # Create RLS policies for gym_activity (user-scoped)
    op.execute("""
        CREATE POLICY "Users can manage their own gym activities" ON dradic_tech.gym_activity
        FOR ALL USING (user_id = auth.uid()::text);
    """)

    # Create trigger for automatic updated_at on exercises
    op.execute("""
        CREATE TRIGGER update_exercises_updated_at
        BEFORE UPDATE ON dradic_tech.exercises
        FOR EACH ROW
        EXECUTE FUNCTION dradic_tech.update_updated_at_column();
    """)

    # Create trigger for automatic updated_at on gym_activity
    op.execute("""
        CREATE TRIGGER update_gym_activity_updated_at
        BEFORE UPDATE ON dradic_tech.gym_activity
        FOR EACH ROW
        EXECUTE FUNCTION dradic_tech.update_updated_at_column();
    """)

    # Insert some default exercises
    op.execute("""
        INSERT INTO dradic_tech.exercises (name, muscles_trained) VALUES
        ('Bench Press', '{"chest": 60, "triceps": 25, "shoulders": 15}'),
        ('Squat', '{"quadriceps": 50, "glutes": 30, "hamstrings": 15, "core": 5}'),
        ('Deadlift', '{"back": 40, "glutes": 25, "hamstrings": 20, "core": 10, "forearms": 5}'),
        ('Pull-up', '{"back": 60, "biceps": 30, "forearms": 10}'),
        ('Push-up', '{"chest": 55, "triceps": 30, "shoulders": 15}'),
        ('Overhead Press', '{"shoulders": 60, "triceps": 25, "core": 15}'),
        ('Barbell Row', '{"back": 60, "biceps": 25, "forearms": 15}'),
        ('Lunges', '{"quadriceps": 45, "glutes": 35, "hamstrings": 15, "core": 5}'),
        ('Dips', '{"triceps": 55, "chest": 30, "shoulders": 15}'),
        ('Bicep Curl', '{"biceps": 85, "forearms": 15}')
        ON CONFLICT (name) DO NOTHING;
    """)


def downgrade():
    # Drop triggers
    op.execute("DROP TRIGGER IF EXISTS update_gym_activity_updated_at ON dradic_tech.gym_activity;")
    op.execute("DROP TRIGGER IF EXISTS update_exercises_updated_at ON dradic_tech.exercises;")

    # Drop tables (cascades will handle foreign keys)
    op.execute("DROP TABLE IF EXISTS dradic_tech.gym_activity CASCADE;")
    op.execute("DROP TABLE IF EXISTS dradic_tech.exercises CASCADE;")
