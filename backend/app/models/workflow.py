import uuid
from sqlalchemy import Column, String, Text, DateTime, ForeignKey, Enum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
from app.db.database import Base

class VisibilityEnum(str, enum.Enum):
    PRIVATE = "PRIVATE"
    ORGANISATION = "ORGANISATION"
    PUBLIC = "PUBLIC"

class Workflow(Base):
    __tablename__ = "workflows"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(128), nullable=False)
    description = Column(Text)
    organisation_id = Column(UUID(as_uuid=True), ForeignKey("organisations.id"), nullable=True)
    created_by = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    visibility = Column(Enum(VisibilityEnum), nullable=False, default=VisibilityEnum.PRIVATE)
    created_at = Column(DateTime, default=datetime.utcnow)

    organisation = relationship("Organisation", back_populates="workflows")
    incidents = relationship("Incident", back_populates="workflow")