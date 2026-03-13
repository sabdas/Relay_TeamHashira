import base64
import os
from typing import Optional
from cryptography.fernet import Fernet
from .config import settings


def get_fernet() -> Optional[Fernet]:
    """Get Fernet cipher. Returns None if key not configured."""
    key = settings.ENCRYPTION_KEY
    if not key:
        return None
    try:
        # Ensure key is properly padded base64
        if len(key) != 44:
            # Generate a valid key from the provided string
            import hashlib
            hash_bytes = hashlib.sha256(key.encode()).digest()
            key = base64.urlsafe_b64encode(hash_bytes).decode()
        return Fernet(key.encode())
    except Exception:
        return None


def encrypt_token(token: str) -> str:
    """Encrypt a token for storage. Returns plaintext if encryption not configured."""
    fernet = get_fernet()
    if not fernet:
        return token
    return fernet.encrypt(token.encode()).decode()


def decrypt_token(encrypted_token: str) -> str:
    """Decrypt a stored token. Returns plaintext if encryption not configured."""
    fernet = get_fernet()
    if not fernet:
        return encrypted_token
    try:
        return fernet.decrypt(encrypted_token.encode()).decode()
    except Exception:
        # Token may be plaintext (e.g., from dev environment)
        return encrypted_token


def generate_fernet_key() -> str:
    """Generate a new Fernet key for .env"""
    return Fernet.generate_key().decode()
