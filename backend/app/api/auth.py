# from fastapi import APIRouter, Depends, HTTPException, status
# from sqlalchemy.orm import Session
# from .. import crud, schemas
# from ..deps import get_db
# from ..auth import create_access_token, verify_password

# # @router.post('/register', response_model=schemas.UserOut)
# # def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
# #     existing = crud.get_user_by_email(db, user.email)
# #     if existing:
# #         raise HTTPException(status_code=400, detail='Email already registered')
# #     return crud.create_user(db, user)

# from fastapi import APIRouter, Depends, HTTPException
# from sqlalchemy.orm import Session
# from .. import models, schemas, auth
# from ..deps import get_db

# router = APIRouter(prefix="/api/auth", tags=["Auth"])


# @router.post("/register")
# def register_user(data: schemas.UserCreate, db: Session = Depends(get_db)):
#     existing = db.query(models.User).filter(models.User.email == data.email).first()
#     if existing:
#         raise HTTPException(status_code=400, detail="Email already registered")

#     hashed_pw = auth.get_password_hash(data.password)
#     code = auth.generate_verification_code()

#     user = models.User(
#         email=data.email,
#         hashed_password=hashed_pw,
#         verification_code=code,
#         is_verified=False,
#     )

#     db.add(user)
#     db.commit()
#     db.refresh(user)

#     # Send the email
#     auth.send_verification_email(user.email, code)

#     return {"message": "Registration successful. Check your email for the code."}


# @router.post("/login", response_model=schemas.Token)
# def login(form_data: schemas.UserCreate, db: Session = Depends(get_db)):
#     user = crud.get_user_by_email(db, form_data.email)
#     if not user or not verify_password(form_data.password, user.hashed_password):
#         raise HTTPException(
#             status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials"
#         )
#     if not user.is_verified:
#         raise HTTPException(status_code=403, detail="Email not verified")
#     token = create_access_token({"sub": user.email, "user_id": user.id})
#     return {"access_token": token, "token_type": "bearer"}


# @router.post("/verify")
# def verify_user(email: str, code: str, db: Session = Depends(get_db)):
#     user = db.query(models.User).filter(models.User.email == email).first()
#     if not user:
#         raise HTTPException(status_code=404, detail="User not found")

#     if user.verification_code != code:
#         raise HTTPException(status_code=400, detail="Invalid verification code")

#     user.is_verified = True
#     user.verification_code = None
#     db.commit()

#     return {"message": "Email verified successfully. You can now log in."}


# import bcrypt
# import random
# import string
# import smtplib
# from email.mime.text import MIMEText
# from datetime import datetime, timedelta
# from jose import jwt
# from passlib.context import CryptContext
# from fastapi import HTTPException, status
# from ..config import settings  # make sure settings has EMAIL, SECRET_KEY, etc.

# # JWT settings
# SECRET_KEY = settings.SECRET_KEY
# ALGORITHM = "HS256"
# ACCESS_TOKEN_EXPIRE_MINUTES = 60

# pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


# # -------------------------------
# # Password Hashing and Verification
# # -------------------------------
# def get_password_hash(password: str) -> str:
#     return pwd_context.hash(password)


# def verify_password(plain_password, hashed_password) -> bool:
#     return pwd_context.verify(plain_password, hashed_password)


# # -------------------------------
# # Token Creation
# # -------------------------------
# def create_access_token(data: dict, expires_delta: timedelta = None):
#     to_encode = data.copy()
#     expire = datetime.utcnow() + (
#         expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
#     )
#     to_encode.update({"exp": expire})
#     return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


# # -------------------------------
# # Email Verification Helpers
# # -------------------------------
# def generate_verification_code(length: int = 6) -> str:
#     """Generate a random 6-digit verification code."""
#     return "".join(random.choices(string.digits, k=length))


# def send_verification_email(to_email: str, code: str):
#     """Send verification code via email using SMTP."""
#     sender_email = settings.SMTP_EMAIL
#     sender_password = settings.SMTP_PASSWORD
#     smtp_server = settings.SMTP_SERVER
#     smtp_port = settings.SMTP_PORT

#     subject = "Verify your Drone UTM account"
#     body = f"""
#     Hello,
#     Your verification code is: {code}

#     Please enter this code on the verification page to complete your registration.

#     Regards,
#     Drone UTM System
#     """

#     msg = MIMEText(body)
#     msg["Subject"] = subject
#     msg["From"] = sender_email
#     msg["To"] = to_email

#     try:
#         with smtplib.SMTP(smtp_server, smtp_port) as server:
#             server.starttls()
#             server.login(sender_email, sender_password)
#             server.sendmail(sender_email, to_email, msg.as_string())
#         print(f"✅ Verification email sent to {to_email}")
#     except Exception as e:
#         print(f"❌ Failed to send verification email: {e}")
#         raise HTTPException(status_code=500, detail="Failed to send verification email")


# from fastapi import APIRouter, Depends, HTTPException, status
# from sqlalchemy.orm import Session
# from datetime import datetime, timedelta
# import random
# import string
# import smtplib
# from email.mime.text import MIMEText
# from jose import jwt
# from passlib.context import CryptContext

# from .. import models, schemas, crud
# from ..deps import get_db
# from ..config import settings

# # -------------------------------
# # Router Setup
# # -------------------------------
# router = APIRouter(prefix="/api/auth", tags=["Authentication"])

# # -------------------------------
# # JWT and Password Config
# # -------------------------------
# SECRET_KEY = settings.SECRET_KEY
# ALGORITHM = settings.ALGORITHM
# ACCESS_TOKEN_EXPIRE_MINUTES = settings.ACCESS_TOKEN_EXPIRE_MINUTES

# pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


# # -------------------------------
# # Password Hashing and Verification
# # -------------------------------
# def get_password_hash(password: str) -> str:
#     return pwd_context.hash(password)


# def verify_password(plain_password: str, hashed_password: str) -> bool:
#     return pwd_context.verify(plain_password, hashed_password)


# # -------------------------------
# # JWT Token Creation
# # -------------------------------
# def create_access_token(data: dict, expires_delta: timedelta = None):
#     to_encode = data.copy()
#     expire = datetime.utcnow() + (
#         expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
#     )
#     to_encode.update({"exp": expire})
#     return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


# # -------------------------------
# # Email Verification Helpers
# # -------------------------------
# def generate_verification_code(length: int = 6) -> str:
#     """Generate a random numeric verification code."""
#     return "".join(random.choices(string.digits, k=length))


# def send_verification_email(to_email: str, code: str):
#     """Send verification email using SMTP."""
#     sender_email = settings.SMTP_EMAIL
#     sender_password = settings.SMTP_PASSWORD
#     smtp_server = settings.SMTP_SERVER
#     smtp_port = settings.SMTP_PORT

#     subject = "Verify your Drone UTM account"
#     body = f"""
#     Hello,
#     Your verification code is: {code}

#     Please enter this code on the verification page to complete your registration.

#     Regards,
#     Drone UTM System
#     """

#     msg = MIMEText(body)
#     msg["Subject"] = subject
#     msg["From"] = sender_email
#     msg["To"] = to_email

#     try:
#         with smtplib.SMTP(smtp_server, smtp_port) as server:
#             server.starttls()
#             server.login(sender_email, sender_password)
#             server.sendmail(sender_email, to_email, msg.as_string())
#         print(f"✅ Verification email sent to {to_email}")
#     except Exception as e:
#         print(f"❌ Failed to send verification email: {e}")
#         raise HTTPException(status_code=500, detail="Failed to send verification email")


# # -------------------------------
# # Register Route
# # -------------------------------
# @router.post("/register")
# def register_user(data: schemas.UserCreate, db: Session = Depends(get_db)):
#     existing = db.query(models.User).filter(models.User.email == data.email).first()
#     if existing:
#         raise HTTPException(status_code=400, detail="Email already registered")

#     hashed_pw = get_password_hash(data.password)
#     code = generate_verification_code()

#     user = models.User(
#         email=data.email,
#         hashed_password=hashed_pw,
#         verification_code=code,
#         is_verified=False,
#     )

#     db.add(user)
#     db.commit()
#     db.refresh(user)

#     send_verification_email(user.email, code)

#     return {"message": "Registration successful. Check your email for the code."}


# # -------------------------------
# # Email Verification Route
# # -------------------------------


# @router.post("/verify")
# def verify_user(data: VerifyRequest, db: Session = Depends(get_db)):
#     user = db.query(models.User).filter(models.User.email == data.email).first()
#     if not user:
#         raise HTTPException(status_code=404, detail="User not found")

#     if user.verification_code != data.code:
#         raise HTTPException(status_code=400, detail="Invalid verification code")

#     user.is_verified = True
#     user.verification_code = None
#     db.commit()

#     return {"message": "Email verified successfully. You can now log in."}


# # -------------------------------
# # Login Route
# # -------------------------------
# @router.post("/login", response_model=schemas.Token)
# def login_user(data: schemas.UserCreate, db: Session = Depends(get_db)):
#     user = crud.get_user_by_email(db, data.email)
#     if not user or not verify_password(data.password, user.hashed_password):
#         raise HTTPException(
#             status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials"
#         )

#     if not user.is_verified:
#         raise HTTPException(status_code=403, detail="Email not verified")

#     token = create_access_token({"sub": user.email, "user_id": user.id})
#     return {"access_token": token, "token_type": "bearer"}


from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from pydantic import BaseModel
import random
import string
import smtplib
from email.mime.text import MIMEText
from jose import jwt
from passlib.context import CryptContext

from .. import models, schemas, crud
from ..deps import get_db
from ..config import settings

# -------------------------------
# Router Setup
# -------------------------------
router = APIRouter(prefix="/api/auth", tags=["Authentication"])

# -------------------------------
# JWT and Password Config
# -------------------------------
SECRET_KEY = settings.SECRET_KEY
ALGORITHM = settings.ALGORITHM
ACCESS_TOKEN_EXPIRE_MINUTES = settings.ACCESS_TOKEN_EXPIRE_MINUTES

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


# -------------------------------
# Helper Schemas
# -------------------------------
class VerifyRequest(BaseModel):
    email: str
    code: str


# -------------------------------
# Password Hashing and Verification
# -------------------------------
def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


# -------------------------------
# JWT Token Creation
# -------------------------------
def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (
        expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


# -------------------------------
# Email Verification Helpers
# -------------------------------
def generate_verification_code(length: int = 6) -> str:
    """Generate a random numeric verification code."""
    return "".join(random.choices(string.digits, k=length))


def send_verification_email(to_email: str, code: str):
    """Send verification email using SMTP."""
    sender_email = settings.SMTP_EMAIL
    sender_password = settings.SMTP_PASSWORD
    smtp_server = settings.SMTP_SERVER
    smtp_port = settings.SMTP_PORT

    subject = "Verify your Drone UTM account"
    body = f"""
    Hello,

    Your verification code is: {code}

    Please enter this code on the verification page to complete your registration.

    Regards,
    Drone UTM System
    """

    msg = MIMEText(body)
    msg["Subject"] = subject
    msg["From"] = sender_email
    msg["To"] = to_email

    try:
        with smtplib.SMTP(smtp_server, smtp_port) as server:
            server.starttls()
            server.login(sender_email, sender_password)
            server.sendmail(sender_email, to_email, msg.as_string())
        print(f"✅ Verification email sent to {to_email}")
    except Exception as e:
        print(f"❌ Failed to send verification email: {e}")
        raise HTTPException(status_code=500, detail="Failed to send verification email")


# -------------------------------
# Register Route
# -------------------------------
@router.post("/register")
def register_user(data: schemas.UserCreate, db: Session = Depends(get_db)):
    existing = db.query(models.User).filter(models.User.email == data.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_pw = get_password_hash(data.password)
    code = generate_verification_code()

    user = models.User(
        email=data.email,
        hashed_password=hashed_pw,
        verification_code=code,
        is_verified=False,
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    send_verification_email(user.email, code)

    return {"message": "Registration successful. Check your email for the code."}


# -------------------------------
# Email Verification Route
# -------------------------------
@router.post("/verify")
def verify_user(data: VerifyRequest, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == data.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if user.verification_code != data.code:
        raise HTTPException(status_code=400, detail="Invalid verification code")

    user.is_verified = True
    user.verification_code = None
    db.commit()

    return {"message": "Email verified successfully. You can now log in."}


# -------------------------------
# Login Route
# -------------------------------
@router.post("/login", response_model=schemas.Token)
def login_user(data: schemas.UserCreate, db: Session = Depends(get_db)):
    user = crud.get_user_by_email(db, data.email)
    if not user or not verify_password(data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials"
        )

    if not user.is_verified:
        raise HTTPException(status_code=403, detail="Email not verified")

    token = create_access_token({"sub": user.email, "user_id": user.id})
    return {"access_token": token, "token_type": "bearer"}
