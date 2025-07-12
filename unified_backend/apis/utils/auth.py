import os
import jwt
from typing import Optional, Dict, Any
from fastapi import HTTPException, Request
from supabase import create_client, Client

async def get_credentials_from_token(token: str) -> Optional[Dict[str, Any]]:
    """
    Extract user credentials from Supabase JWT token
    """
    try:
        # Get Supabase configuration
        supabase_url = os.getenv("SUPABASE_URL")
        supabase_service_key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
        
        if not supabase_url or not supabase_service_key:
            raise ValueError("Missing Supabase configuration")
        
        # Create Supabase client
        supabase: Client = create_client(supabase_url, supabase_service_key)
        
        # Verify token using Supabase
        response = supabase.auth.get_user(token)
        user = response.user
        
        if user:
            return {
                "uid": user.id,
                "email": user.email,
                "name": user.user_metadata.get("name", ""),
                "email_verified": user.email_confirmed_at is not None,
                "role": user.role or "authenticated"
            }
        
        return None
        
    except Exception as e:
        print(f"Token verification failed: {e}")
        return None

async def get_current_user(request: Request) -> dict:
    """Get the current authenticated user from request state"""
    user = getattr(request.state, 'current_user', None)
    if user is None:
        raise HTTPException(status_code=401, detail="Authentication required")
    return user

async def get_current_user_optional(request: Request) -> Optional[dict]:
    """Get the current user if authenticated, None otherwise"""
    return getattr(request.state, 'current_user', None)
