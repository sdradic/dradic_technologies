from fastapi import APIRouter, HTTPException, Depends, Header
from fastapi.security import HTTPBearer
from typing import List, Optional
from datetime import datetime
import re

from models import (
    BlogPost, 
    BlogPostMetadata, 
    BlogPostCreate, 
    BlogPostUpdate, 
    BlogPostResponse,
    AuthUser,
    AuthToken
)
from utils.supabase_service import supabase_service

blog_router = APIRouter()
security = HTTPBearer()

async def get_current_user(authorization: str = Header(None)) -> Optional[AuthUser]:
    """Verify Supabase token and return user info"""
    if not authorization:
        return None
    
    try:
        # Extract token from "Bearer <token>"
        token = authorization.replace("Bearer ", "")
        user_info = supabase_service.verify_token(token)
        
        if user_info:
            return AuthUser(**user_info)
        return None
    except Exception as e:
        return None

def require_auth(user: Optional[AuthUser] = Depends(get_current_user)) -> AuthUser:
    """Require authentication for protected routes"""
    if not user:
        raise HTTPException(status_code=401, detail="Authentication required")
    return user

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
    body = content[end_index + 3:]
    
    # Update or add the field
    lines = frontmatter.split('\n')
    field_found = False
    
    for i, line in enumerate(lines):
        if line.strip().startswith(f"{field}:"):
            lines[i] = f"{field}: {value}"
            field_found = True
            break
    
    if not field_found:
        lines.append(f"{field}: {value}")
    
    updated_frontmatter = '\n'.join(lines)
    return f"---{updated_frontmatter}---{body}"

@blog_router.get("/posts", response_model=BlogPostResponse)
async def get_blog_posts():
    """Get all blog posts with metadata"""
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
                    content=content
                )
                posts.append(post)
        
        # Sort by updated_at (newest first)
        posts.sort(key=lambda x: x.updated_at, reverse=True)
        
        return BlogPostResponse(posts=posts, total_count=len(posts))
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch blog posts: {str(e)}")

@blog_router.get("/posts/{slug}", response_model=BlogPost)
async def get_blog_post(slug: str):
    """Get a specific blog post by slug"""
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
            content=content
        )
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch blog post: {str(e)}")

@blog_router.post("/posts", response_model=BlogPost)
async def create_blog_post(
    post_data: BlogPostCreate,
    user: AuthUser = Depends(require_auth)
):
    """Create a new blog post"""
    try:
        # Validate slug
        if not re.match(r'^[a-z0-9-]+$', post_data.slug):
            raise HTTPException(
                status_code=400, 
                detail="Slug must contain only lowercase letters, numbers, and hyphens"
            )
        
        # Check if post already exists
        existing_content = supabase_service.get_blog_post_content(post_data.slug)
        if existing_content:
            raise HTTPException(status_code=409, detail="Blog post with this slug already exists")
        
        # Create frontmatter
        now = datetime.now().isoformat()
        frontmatter = f"""---
title: {post_data.title}
created_at: {now}
updated_at: {now}
image: {post_data.image or ""}
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
            content=frontmatter
        )
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create blog post: {str(e)}")

@blog_router.put("/posts/{slug}", response_model=BlogPost)
async def update_blog_post(
    slug: str,
    post_data: BlogPostUpdate,
    user: AuthUser = Depends(require_auth)
):
    """Update an existing blog post"""
    try:
        # Get existing post
        existing_content = supabase_service.get_blog_post_content(slug)
        if not existing_content:
            raise HTTPException(status_code=404, detail="Blog post not found")
        
        updated_content = existing_content
        now = datetime.now().isoformat()
        
        # Update fields if provided
        if post_data.title is not None:
            updated_content = update_frontmatter_field(updated_content, "title", post_data.title)
        
        if post_data.image is not None:
            updated_content = update_frontmatter_field(updated_content, "image", post_data.image)
        
        # Always update the updated_at timestamp
        updated_content = update_frontmatter_field(updated_content, "updated_at", now)
        
        # Update content if provided
        if post_data.content is not None:
            # Extract frontmatter and replace body
            if updated_content.startswith("---"):
                end_index = updated_content.find("---", 3)
                if end_index != -1:
                    frontmatter_part = updated_content[:end_index + 3]
                    updated_content = f"{frontmatter_part}\n\n{post_data.content}"
            else:
                updated_content = post_data.content
        
        # Upload updated content
        success = supabase_service.upload_blog_post(slug, updated_content)
        if not success:
            raise HTTPException(status_code=500, detail="Failed to update blog post")
        
        # Parse and return updated post
        metadata = supabase_service.parse_blog_post_metadata(updated_content)
        
        return BlogPost(
            slug=slug,
            title=metadata.get("title", "Untitled"),
            created_at=metadata.get("created_at", now),
            updated_at=metadata.get("updated_at", now),
            image=metadata.get("image", ""),
            content=updated_content
        )
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update blog post: {str(e)}")

@blog_router.delete("/posts/{slug}")
async def delete_blog_post(
    slug: str,
    user: AuthUser = Depends(require_auth)
):
    """Delete a blog post"""
    try:
        success = supabase_service.delete_blog_post(slug)
        if not success:
            raise HTTPException(status_code=404, detail="Blog post not found")
        
        return {"message": f"Blog post '{slug}' deleted successfully"}
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete blog post: {str(e)}")

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
        raise HTTPException(status_code=500, detail=f"Token verification failed: {str(e)}")

@blog_router.get("/posts-metadata", response_model=List[BlogPostMetadata])
async def get_blog_posts_metadata():
    """Get blog posts metadata only (without content)"""
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
                    image=metadata.get("image", "")
                )
                posts_metadata.append(post_metadata)
        
        # Sort by updated_at (newest first)
        posts_metadata.sort(key=lambda x: x.updated_at, reverse=True)
        
        return posts_metadata
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch blog posts metadata: {str(e)}")
