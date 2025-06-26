import os
import json
from typing import List, Optional, Dict, Any
import firebase_admin
from firebase_admin import credentials, auth, storage
from google.cloud import storage as gcs
from datetime import datetime
import logging

logger = logging.getLogger(__name__)

class FirebaseService:
    def __init__(self):
        self._initialized = False
        self._bucket = None
        self._storage_client = None
        self._bucket_name = None
        
    def initialize(self):
        """Initialize Firebase Admin SDK"""
        if self._initialized:
            return
            
        try:
            # Get required environment variables
            project_id = os.getenv("FIREBASE_PROJECT_ID")
            private_key_id = os.getenv("FIREBASE_PRIVATE_KEY_ID")
            private_key = os.getenv("FIREBASE_PRIVATE_KEY")
            client_email = os.getenv("FIREBASE_CLIENT_EMAIL")
            client_id = os.getenv("FIREBASE_CLIENT_ID")
            cert_url = os.getenv("FIREBASE_CERT_URL")
            
            # Validate required variables
            if not all([project_id, private_key_id, private_key, client_email, client_id]):
                logger.error(f"Missing required Firebase environment variables: {project_id}, {private_key_id}, {private_key}, {client_email}, {client_id}")
                raise ValueError("Missing required Firebase environment variables")
            
            # Fix private key formatting
            if private_key:
                # Ensure proper line breaks in private key
                private_key = private_key.replace('\\n', '\n')
                
                # Ensure it starts and ends with proper markers
                if not private_key.startswith('-----BEGIN PRIVATE KEY-----'):
                    private_key = '-----BEGIN PRIVATE KEY-----\n' + private_key
                if not private_key.endswith('-----END PRIVATE KEY-----\n'):
                    if not private_key.endswith('\n'):
                        private_key += '\n'
                    private_key += '-----END PRIVATE KEY-----\n'
                
            firebase_config = {
                "type": "service_account",
                "project_id": project_id,
                "private_key_id": private_key_id,
                "private_key": private_key,
                "client_email": client_email,
                "client_id": client_id,
                "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                "token_uri": "https://oauth2.googleapis.com/token",
                "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
                "client_x509_cert_url": cert_url or f"https://www.googleapis.com/robot/v1/metadata/x509/{client_email.replace('@', '%40')}"
            }
            
            cred = credentials.Certificate(firebase_config)
            self._bucket_name = os.getenv("FIREBASE_STORAGE_BUCKET") or f"{project_id}.appspot.com"
            
            # Initialize Firebase Admin
            if not firebase_admin._apps:
                firebase_admin.initialize_app(cred, {
                    'storageBucket': self._bucket_name
                })
            
            # Initialize storage
            self._bucket = storage.bucket()
            
            # Initialize storage client with the same credentials
            if firebase_config:
                self._storage_client = gcs.Client.from_service_account_info(firebase_config)
            else:
                self._storage_client = gcs.Client.from_service_account_json(service_account_file)
            
            self._initialized = True
            logger.info(f"Firebase service initialized successfully with bucket: {self._bucket_name}")
            
        except Exception as e:
            logger.error(f"Failed to initialize Firebase service: {e}")
            # Log more details for debugging
            if "MalformedFraming" in str(e):
                logger.error("Private key formatting issue. Ensure FIREBASE_PRIVATE_KEY includes proper \\n characters")
            raise
    
    def verify_token(self, id_token: str) -> Optional[Dict[str, Any]]:
        """Verify Firebase ID token and return user info"""
        try:
            self.initialize()
            decoded_token = auth.verify_id_token(id_token)
            return {
                "uid": decoded_token["uid"],
                "email": decoded_token.get("email", ""),
                "name": decoded_token.get("name", decoded_token.get("email", "").split("@")[0]),
                "email_verified": decoded_token.get("email_verified", False)
            }
        except Exception as e:
            logger.error(f"Token verification failed: {e}")
            return None
    
    def list_blog_posts(self) -> List[str]:
        """List all blog post files in Firebase Storage"""
        try:
            self.initialize()
            blobs = list(self._storage_client.list_blobs(self._bucket_name, prefix="blog_posts/"))
            return [blob.name.replace("blog_posts/", "").replace(".md", "") 
                   for blob in blobs if blob.name.endswith(".md")]
        except Exception as e:
            logger.error(f"Failed to list blog posts: {e}")
            raise
    
    def get_blog_post_content(self, slug: str) -> Optional[str]:
        """Get blog post content from Firebase Storage"""
        try:
            self.initialize()
            blob = self._storage_client.bucket(self._bucket_name).blob(f"blog_posts/{slug}.md")
            if blob.exists():
                return blob.download_as_text()
            return None
        except Exception as e:
            logger.error(f"Failed to get blog post {slug}: {e}")
            raise
    
    def upload_blog_post(self, slug: str, content: str) -> bool:
        """Upload blog post to Firebase Storage"""
        try:
            self.initialize()
            blob = self._storage_client.bucket(self._bucket_name).blob(f"blog_posts/{slug}.md")
            blob.upload_from_string(content, content_type="text/markdown")
            return True
        except Exception as e:
            logger.error(f"Failed to upload blog post {slug}: {e}")
            return False
    
    def delete_blog_post(self, slug: str) -> bool:
        """Delete blog post from Firebase Storage"""
        try:
            self.initialize()
            blob = self._storage_client.bucket(self._bucket_name).blob(f"blog_posts/{slug}.md")
            if blob.exists():
                blob.delete()
                return True
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
firebase_service = FirebaseService() 