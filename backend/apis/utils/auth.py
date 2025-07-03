import os
import jwt
from typing import Optional, Dict, Any
from fastapi import HTTPException
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
                "user_id": user.id,
                "email": user.email,
                "name": user.user_metadata.get("name", ""),
                "email_verified": user.email_confirmed_at is not None,
                "role": user.role or "authenticated"
            }
        
        return None
        
    except Exception as e:
        print(f"Token verification failed: {e}")
        return None

async def verify_user_access(token: str, required_role: str = "authenticated") -> Dict[str, Any]:
    """
    Verify user has required access level
    """
    credentials = await get_credentials_from_token(token)
    
    if not credentials:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    
    user_role = credentials.get("role", "")
    
    # Basic role checking (you can expand this logic)
    if required_role == "admin" and user_role != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    
    return credentials
