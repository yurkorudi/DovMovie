import os, json, base64, hashlib

LIQPAY_PUBLIC_KEY  = os.environ.get("LIQPAY_PUBLIC_KEY",  "")
LIQPAY_PRIVATE_KEY = os.environ.get("LIQPAY_PRIVATE_KEY", "")

def lp_encode(params: dict) -> str:
    """Base64(JSON(params)) -> 'data' для LiqPay."""
    return base64.b64encode(json.dumps(params, ensure_ascii=False).encode("utf-8")).decode("utf-8")

def lp_signature(data_b64: str) -> str:
    """Base64( SHA1( private_key + data + private_key ) )."""
    digest = hashlib.sha1((LIQPAY_PRIVATE_KEY + data_b64 + LIQPAY_PRIVATE_KEY).encode("utf-8")).digest()
    return base64.b64encode(digest).decode("utf-8")
