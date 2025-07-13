import re
from datetime import datetime
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.security import HTTPBearer

from models import (
    AuthToken,
    AuthUser,
    BlogPost,
    BlogPostCreate,
    BlogPostMetadata,
    BlogPostResponse,
    BlogPostUpdate,
)
from utils.auth import get_current_user, get_current_user_optional
from utils.supabase_service import supabase_service

blog_router = APIRouter()
security = HTTPBearer()


async def require_auth(request: Request) -> AuthUser:
    """Require authentication for protected endpoints and return AuthUser"""
    user_info = await get_current_user(request)
    return AuthUser(**user_info)


def validate_user_permissions(user: dict) -> bool:
    """Validate if user has permissions to manage blog posts"""
    # For now, any authenticated user can manage blog posts
    # You can implement role-based permissions here
    return True


def update_frontmatter_field(content: str, field: str, value: str) -> str:
    """Update a specific field in the frontmatter"""
    if not content.startswith("---"):
        # Create new frontmatter
        frontmatter = f"---\n{field}: {value}\n---\n{content}"
        return frontmatter

    # Find the end of frontmatter
    end_index = content.find("---", 3)
    if end_index == -1:
        return content

    frontmatter = content[3:end_index]
    body = content[end_index + 3 :]

    # Update or add the field
    lines = frontmatter.split("\n")
    field_found = False

    for i, line in enumerate(lines):
        if line.strip().startswith(f"{field}:"):
            lines[i] = f"{field}: {value}"
            field_found = True
            break

    if not field_found:
        lines.append(f"{field}: {value}")

    updated_frontmatter = "\n".join(lines)
    return f"---{updated_frontmatter}---{body}"


@blog_router.get("/posts", response_model=BlogPostResponse)
async def get_blog_posts(
    current_user: Optional[dict] = Depends(get_current_user_optional),
):
    """Get all blog posts with metadata (public endpoint)"""
    try:
        post_slugs = supabase_service.list_blog_posts()
        posts: List[BlogPost] = []

        for slug in post_slugs:
            content = supabase_service.get_blog_post_content(slug)
            if content:
                metadata = supabase_service.parse_blog_post_metadata(content)

                post = BlogPost(
                    slug=slug,
                    title=metadata.get("title", "Untitled"),
                    created_at=metadata.get("created_at", datetime.now().isoformat()),
                    updated_at=metadata.get("updated_at", datetime.now().isoformat()),
                    image=metadata.get("image", ""),
                    content=content,
                )
                posts.append(post)

        # Sort by updated_at (newest first)
        posts.sort(key=lambda x: x.updated_at, reverse=True)

        return BlogPostResponse(posts=posts, total_count=len(posts))

    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Failed to fetch blog posts: {str(e)}"
        )


@blog_router.get("/posts/{slug}", response_model=BlogPost)
async def get_blog_post(
    slug: str, current_user: Optional[dict] = Depends(get_current_user_optional)
):
    """Get a specific blog post by slug (public endpoint)"""
    try:
        content = supabase_service.get_blog_post_content(slug)
        if not content:
            raise HTTPException(status_code=404, detail="Blog post not found")

        metadata = supabase_service.parse_blog_post_metadata(content)

        return BlogPost(
            slug=slug,
            title=metadata.get("title", "Untitled"),
            created_at=metadata.get("created_at", datetime.now().isoformat()),
            updated_at=metadata.get("updated_at", datetime.now().isoformat()),
            image=metadata.get("image", ""),
            content=content,
        )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Failed to fetch blog post: {str(e)}"
        )


@blog_router.post("/posts", response_model=BlogPost)
async def create_blog_post(
    post_data: BlogPostCreate, user: AuthUser = Depends(require_auth)
):
    """Create a new blog post (requires authentication)"""
    try:
        # Validate user permissions
        if not validate_user_permissions(user.dict()):
            raise HTTPException(
                status_code=403, detail="Insufficient permissions to create blog posts"
            )

        # Validate slug
        if not re.match(r"^[a-z0-9-]+$", post_data.slug):
            raise HTTPException(
                status_code=400,
                detail="Slug must contain only lowercase letters, numbers, and hyphens",
            )

        # Check if post already exists
        existing_content = supabase_service.get_blog_post_content(post_data.slug)
        if existing_content:
            raise HTTPException(
                status_code=409, detail="Blog post with this slug already exists"
            )

        # Create frontmatter
        now = datetime.now().isoformat()
        frontmatter = f"""---
title: {post_data.title}
created_at: {now}
updated_at: {now}
image: {post_data.image or ""}
category: {post_data.category or ""}
author: {post_data.author or ""}
---

{post_data.content}"""

        # Upload to Supabase
        success = supabase_service.upload_blog_post(post_data.slug, frontmatter)
        if not success:
            raise HTTPException(status_code=500, detail="Failed to create blog post")

        return BlogPost(
            slug=post_data.slug,
            title=post_data.title,
            created_at=now,
            updated_at=now,
            image=post_data.image or "",
            content=frontmatter,
        )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Failed to create blog post: {str(e)}"
        )


@blog_router.put("/posts/{slug}", response_model=BlogPost)
async def update_blog_post(
    slug: str, post_data: BlogPostUpdate, user: AuthUser = Depends(require_auth)
):
    """Update an existing blog post (requires authentication)"""
    try:
        # Validate user permissions
        if not validate_user_permissions(user.dict()):
            raise HTTPException(
                status_code=403, detail="Insufficient permissions to update blog posts"
            )

        # Check if post exists
        existing_content = supabase_service.get_blog_post_content(slug)
        if not existing_content:
            raise HTTPException(status_code=404, detail="Blog post not found")

        # Parse existing metadata
        existing_metadata = supabase_service.parse_blog_post_metadata(existing_content)

        # Update frontmatter
        now = datetime.now().isoformat()
        updated_title = (
            post_data.title
            if post_data.title is not None
            else existing_metadata.get("title", "Untitled")
        )
        updated_image = (
            post_data.image
            if post_data.image is not None
            else existing_metadata.get("image", "")
        )
        updated_content = (
            post_data.content if post_data.content is not None else existing_content
        )

        frontmatter = f"""---
title: {updated_title}
created_at: {existing_metadata.get("created_at", now)}
updated_at: {now}
image: {updated_image}
category: {post_data.category or ""}
author: {post_data.author or ""}
---

{updated_content.split("---", 2)[-1].strip() if "---" in updated_content else updated_content}"""

        # Upload to Supabase
        success = supabase_service.upload_blog_post(slug, frontmatter)
        if not success:
            raise HTTPException(status_code=500, detail="Failed to update blog post")

        return BlogPost(
            slug=slug,
            title=updated_title,
            created_at=existing_metadata.get("created_at", now),
            updated_at=now,
            image=updated_image,
            content=frontmatter,
        )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Failed to update blog post: {str(e)}"
        )


@blog_router.delete("/posts/{slug}")
async def delete_blog_post(slug: str, user: AuthUser = Depends(require_auth)):
    """Delete a blog post (requires authentication)"""
    try:
        # Validate user permissions
        if not validate_user_permissions(user.dict()):
            raise HTTPException(
                status_code=403, detail="Insufficient permissions to delete blog posts"
            )

        # Check if post exists
        existing_content = supabase_service.get_blog_post_content(slug)
        if not existing_content:
            raise HTTPException(status_code=404, detail="Blog post not found")

        # Delete from Supabase
        success = supabase_service.delete_blog_post(slug)
        if not success:
            raise HTTPException(status_code=500, detail="Failed to delete blog post")

        return {"message": f"Blog post '{slug}' deleted successfully"}

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Failed to delete blog post: {str(e)}"
        )


@blog_router.post("/auth/verify")
async def verify_auth_token(token_data: AuthToken):
    """Verify Supabase authentication token"""
    try:
        user_info = supabase_service.verify_token(token_data.token)
        if not user_info:
            raise HTTPException(status_code=401, detail="Invalid or expired token")

        return AuthUser(**user_info)

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Token verification failed: {str(e)}"
        )


@blog_router.get("/posts-metadata", response_model=List[BlogPostMetadata])
async def get_blog_posts_metadata(
    current_user: Optional[dict] = Depends(get_current_user_optional),
):
    """Get blog posts metadata only (without content) (public endpoint)"""
    try:
        post_slugs = supabase_service.list_blog_posts()
        posts_metadata: List[BlogPostMetadata] = []

        for slug in post_slugs:
            content = supabase_service.get_blog_post_content(slug)
            if content:
                metadata = supabase_service.parse_blog_post_metadata(content)

                post_metadata = BlogPostMetadata(
                    slug=slug,
                    title=metadata.get("title", "Untitled"),
                    created_at=metadata.get("created_at", datetime.now().isoformat()),
                    updated_at=metadata.get("updated_at", datetime.now().isoformat()),
                    image=metadata.get("image", ""),
                    category=metadata.get("category", ""),
                    author=metadata.get("author", ""),
                )
                posts_metadata.append(post_metadata)

        # Sort by updated_at (newest first)
        posts_metadata.sort(key=lambda x: x.updated_at, reverse=True)

        return posts_metadata

    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Failed to fetch blog posts metadata: {str(e)}"
        )
