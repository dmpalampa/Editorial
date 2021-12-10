package com.monitor.editorial.entities;

import javax.persistence.*;
import java.sql.Date;
import java.sql.Timestamp;
import java.util.Set;

@Entity
@Table(name = "story_category", schema = "public", catalog = "postgres")
public class Entity_StoryCategory {
	private Long sCategoryId;
	private String categoryNumber;
	private String categoryName;
	private Timestamp createdOn;
	private Timestamp updatedOn;
	private String createdBy;
	private Date updateBy;
	private Long version;
	private Long supervisor;
	private String description;
	private Entity_Users supervisorInCharge;
	
	private Set<Entity_Users> categoryEditors;

	@Id
	@Column(name = "s_category_id", nullable = false)
	public Long getsCategoryId() {
		return sCategoryId;
	}

	public void setsCategoryId(Long sCategoryId) {
		this.sCategoryId = sCategoryId;
	}

	@Basic
	@Column(name = "category_number", nullable = true, length = -1)
	public String getCategoryNumber() {
		return categoryNumber;
	}

	public void setCategoryNumber(String categoryNumber) {
		this.categoryNumber = categoryNumber;
	}

	@Basic
	@Column(name = "category_name", nullable = true, length = -1)
	public String getCategoryName() {
		return categoryName;
	}

	public void setCategoryName(String categoryName) {
		this.categoryName = categoryName;
	}

	@Basic
	@Column(name = "created_on", nullable = true)
	public Timestamp getCreatedOn() {
		return createdOn;
	}

	public void setCreatedOn(Timestamp createdOn) {
		this.createdOn = createdOn;
	}

	@Basic
	@Column(name = "updated_on", nullable = true)
	public Timestamp getUpdatedOn() {
		return updatedOn;
	}

	public void setUpdatedOn(Timestamp updatedOn) {
		this.updatedOn = updatedOn;
	}

	@Basic
	@Column(name = "created_by", nullable = true, length = 64)
	public String getCreatedBy() {
		return createdBy;
	}

	public void setCreatedBy(String createdBy) {
		this.createdBy = createdBy;
	}

	@Basic
	@Column(name = "update_by", nullable = true)
	public Date getUpdateBy() {
		return updateBy;
	}

	public void setUpdateBy(Date updateBy) {
		this.updateBy = updateBy;
	}

	@Basic
	@Column(name = "version", nullable = true)
	public Long getVersion() {
		return version;
	}

	public void setVersion(Long version) {
		this.version = version;
	}
	
	public Set<Entity_Users> getCategoryEditors() {
		return categoryEditors;
	}

	public void setCategoryEditors(Set<Entity_Users> categoryEditors) {
		this.categoryEditors = categoryEditors;
	}
	
	public Long getSupervisor() {
		return supervisor;
	}

	public void setSupervisor(Long supervisor) {
		this.supervisor = supervisor;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}
	public Entity_Users getSupervisorInCharge() {
		return supervisorInCharge;
	}

	public void setSupervisorInCharge(Entity_Users supervisorInCharge) {
		this.supervisorInCharge = supervisorInCharge;
	}

	@Override
	public boolean equals(Object o) {
		if (this == o)
			return true;
		if (o == null || getClass() != o.getClass())
			return false;

		Entity_StoryCategory that = (Entity_StoryCategory) o;

		if (sCategoryId != null ? !sCategoryId.equals(that.sCategoryId) : that.sCategoryId != null)
			return false;
		if (categoryNumber != null ? !categoryNumber.equals(that.categoryNumber) : that.categoryNumber != null)
			return false;
		if (categoryName != null ? !categoryName.equals(that.categoryName) : that.categoryName != null)
			return false;
		if (createdOn != null ? !createdOn.equals(that.createdOn) : that.createdOn != null)
			return false;
		if (updatedOn != null ? !updatedOn.equals(that.updatedOn) : that.updatedOn != null)
			return false;
		if (createdBy != null ? !createdBy.equals(that.createdBy) : that.createdBy != null)
			return false;
		if (updateBy != null ? !updateBy.equals(that.updateBy) : that.updateBy != null)
			return false;
		if (version != null ? !version.equals(that.version) : that.version != null)
			return false;
		if (categoryEditors != null ? !categoryEditors.equals(that.categoryEditors) : that.categoryEditors != null)
			return false;
		if (supervisor != null ? !supervisor.equals(that.supervisor) : that.supervisor != null)
			return false;
		if (description != null ? !description.equals(that.description) : that.description != null)
			return false;
		if (supervisorInCharge != null ? !supervisorInCharge.equals(that.supervisorInCharge) : that.supervisorInCharge != null)
			return false;
		return true;
	}

	@Override
	public int hashCode() {
		int result = sCategoryId != null ? sCategoryId.hashCode() : 0;
		result = 31 * result + (categoryNumber != null ? categoryNumber.hashCode() : 0);
		result = 31 * result + (categoryName != null ? categoryName.hashCode() : 0);
		result = 31 * result + (createdOn != null ? createdOn.hashCode() : 0);
		result = 31 * result + (updatedOn != null ? updatedOn.hashCode() : 0);
		result = 31 * result + (createdBy != null ? createdBy.hashCode() : 0);
		result = 31 * result + (updateBy != null ? updateBy.hashCode() : 0);
		result = 31 * result + (version != null ? version.hashCode() : 0);
		result = 31 * result + (categoryEditors != null ? categoryEditors.hashCode() : 0);
		result = 31 * result + (supervisor != null ? supervisor.hashCode() : 0);
		result = 31 * result + (description != null ? description.hashCode() : 0);
		result = 31 * result + (supervisorInCharge != null ? supervisorInCharge.hashCode() : 0);
		return result;
	}





	
}
