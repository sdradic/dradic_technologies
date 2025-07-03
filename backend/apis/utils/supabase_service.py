import os
import boto3
from typing import List, Optional, Dict, Any
from supabase import create_client, Client
import logging
from botocore.exceptions import ClientError

logger = logging.getLogger(__name__)

class SupabaseService:
    def __init__(self):
        self._initialized = False
        self._s3_client = None
        self._supabase: Optional[Client] = None
        self._bucket_name = "dradic-technologies"
        
    def initialize(self):
        """Initialize Supabase client and S3 storage"""
        if self._initialized:
            return
            
        try:
            # Get required environment variables
            supabase_url = os.getenv("SUPABASE_URL")
            supabase_service_key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
            storage_access_key_id = os.getenv("SUPABASE_STORAGE_ACCESS_KEY_ID")
            storage_secret_access_key = os.getenv("SUPABASE_STORAGE_SECRET_ACCESS_KEY")
            
            # Validate required variables
            if not all([supabase_url, supabase_service_key]):
                logger.error("Missing required Supabase environment variables")
                raise ValueError("Missing required Supabase environment variables: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY")
            
            # Initialize Supabase client
            self._supabase = create_client(supabase_url, supabase_service_key)
            
            # Initialize S3 client for storage if credentials are provided
            if storage_access_key_id and storage_secret_access_key:
                # Extract project reference from Supabase URL for S3 endpoint
                project_ref = supabase_url.split('//')[1].split('.')[0]
                s3_endpoint = f"https://{project_ref}.supabase.co/storage/v1/s3"
                
                self._s3_client = boto3.client(
                    's3',
                    endpoint_url=s3_endpoint,
                    aws_access_key_id=storage_access_key_id,
                    aws_secret_access_key=storage_secret_access_key,
                    region_name='us-east-1'  # Supabase uses us-east-1 for S3 compatibility
                )
                
                logger.info("S3-compatible storage initialized")
            else:
                logger.warning("Storage credentials not provided, storage features will be disabled")
            
            self._initialized = True
            logger.info("Supabase service initialized successfully")
            
        except Exception as e:
            logger.error(f"Failed to initialize Supabase service: {e}")
            raise
    
    def verify_token(self, id_token: str) -> Optional[Dict[str, Any]]:
        """Verify Supabase JWT token and return user info"""
        try:
            self.initialize()
            
            # Verify the JWT token using Supabase
            response = self._supabase.auth.get_user(id_token)
            user = response.user
            
            if user:
                return {
                    "uid": user.id,
                    "email": user.email or "",
                    "name": user.user_metadata.get("name", user.email.split("@")[0] if user.email else ""),
                    "email_verified": user.email_confirmed_at is not None
                }
            return None
            
        except Exception as e:
            logger.error(f"Token verification failed: {e}")
            return None
    
    def list_blog_posts(self) -> List[str]:
        """List all blog post files in Supabase Storage"""
        try:
            self.initialize()
            
            if not self._s3_client:
                # Fallback to Supabase Storage API
                files = self._supabase.storage.from_(self._bucket_name).list("blog_posts")
                return [f["name"].replace(".md", "") for f in files if f["name"].endswith(".md")]
            
            # Use S3 API
            response = self._s3_client.list_objects_v2(Bucket=self._bucket_name)
            
            if 'Contents' not in response:
                return []
                
            return [obj['Key'].replace("blog_posts/", "").replace(".md", "") for obj in response['Contents'] 
                   if obj['Key'].endswith(".md")]
                   
        except ClientError as e:
            logger.error(f"Failed to list blog posts via S3: {e}")
            # Fallback to Supabase Storage API
            try:
                files = self._supabase.storage.from_(self._bucket_name).list("blog_posts")
                return [f["name"].replace(".md", "") for f in files if f["name"].endswith(".md")]
            except Exception as fallback_e:
                logger.error(f"Fallback to Supabase API also failed: {fallback_e}")
                raise
        except Exception as e:
            logger.error(f"Failed to list blog posts: {e}")
            raise
    
    def get_blog_post_content(self, slug: str) -> Optional[str]:
        """Get blog post content from Supabase Storage"""
        try:
            self.initialize()
            
            if not self._s3_client:
                # Fallback to Supabase Storage API
                response = self._supabase.storage.from_(self._bucket_name).download(f"blog_posts/{slug}.md")
                return response.decode('utf-8') if response else None
            
            # Use S3 API
            response = self._s3_client.get_object(Bucket=self._bucket_name, Key=f"blog_posts/{slug}.md")
            return response['Body'].read().decode('utf-8')
            
        except ClientError as e:
            if e.response['Error']['Code'] == 'NoSuchKey':
                return None
            logger.error(f"Failed to get blog post {slug} via S3: {e}")
            # Fallback to Supabase Storage API
            try:
                response = self._supabase.storage.from_(self._bucket_name).download(f"blog_posts/{slug}.md")
                return response.decode('utf-8') if response else None
            except Exception as fallback_e:
                logger.error(f"Fallback to Supabase API also failed: {fallback_e}")
                return None
        except Exception as e:
            logger.error(f"Failed to get blog post {slug}: {e}")
            return None
    
    def upload_blog_post(self, slug: str, content: str) -> bool:
        """Upload blog post to Supabase Storage"""
        try:
            self.initialize()
            
            if not self._s3_client:
                # Fallback to Supabase Storage API
                response = self._supabase.storage.from_(self._bucket_name).upload(
                    f"blog_posts/{slug}.md", 
                    content.encode('utf-8'),
                    file_options={"content-type": "text/markdown"}
                )
                return response is not None
            
            # Use S3 API
            self._s3_client.put_object(
                Bucket=self._bucket_name,
                Key=f"blog_posts/{slug}.md",
                Body=content.encode('utf-8'),
                ContentType="text/markdown"
            )
            return True
            
        except ClientError as e:
            logger.error(f"Failed to upload blog post {slug} via S3: {e}")
            # Fallback to Supabase Storage API
            try:
                response = self._supabase.storage.from_(self._bucket_name).upload(
                    f"blog_posts/{slug}.md", 
                    content.encode('utf-8'),
                    file_options={"content-type": "text/markdown"}
                )
                return response is not None
            except Exception as fallback_e:
                logger.error(f"Fallback to Supabase API also failed: {fallback_e}")
                return False
        except Exception as e:
            logger.error(f"Failed to upload blog post {slug}: {e}")
            return False
    
    def delete_blog_post(self, slug: str) -> bool:
        """Delete blog post from Supabase Storage"""
        try:
            self.initialize()
            
            if not self._s3_client:
                # Fallback to Supabase Storage API
                response = self._supabase.storage.from_(self._bucket_name).remove([f"blog_posts/{slug}.md"])
                return len(response) > 0
            
            # Use S3 API
            self._s3_client.delete_object(Bucket=self._bucket_name, Key=f"blog_posts/{slug}.md")
            return True
            
        except ClientError as e:
            logger.error(f"Failed to delete blog post {slug} via S3: {e}")
            # Fallback to Supabase Storage API
            try:
                response = self._supabase.storage.from_(self._bucket_name).remove([f"blog_posts/{slug}.md"])
                return len(response) > 0
            except Exception as fallback_e:
                logger.error(f"Fallback to Supabase API also failed: {fallback_e}")
                return False
        except Exception as e:
            logger.error(f"Failed to delete blog post {slug}: {e}")
            return False
    
    def parse_blog_post_metadata(self, content: str) -> Dict[str, str]:
        """Parse frontmatter metadata from blog post content"""
        try:
            if not content.startswith("---"):
                return {}
            
            # Find the end of frontmatter
            end_index = content.find("---", 3)
            if end_index == -1:
                return {}
            
            frontmatter = content[3:end_index].strip()
            metadata = {}
            
            for line in frontmatter.split("\n"):
                if ":" in line:
                    key, value = line.split(":", 1)
                    metadata[key.strip()] = value.strip()
            
            return metadata
        except Exception as e:
            logger.error(f"Failed to parse metadata: {e}")
            return {}

# Global instance
supabase_service = SupabaseService() 