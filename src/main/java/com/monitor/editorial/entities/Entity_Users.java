package com.monitor.editorial.entities;

import javax.persistence.*;
import java.sql.Date;
import java.sql.Timestamp;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "users", schema = "public", catalog = "postgres")
public class Entity_Users {
	private Long userId;
	private String firstName;
	private String lastName;
	private String username;
	private String password;
	private Timestamp createdOn;
	private String createdBy;
	private Timestamp updatedOn;
	private String updatedBy;
	private Long roleId;
	private String idCardNumber;
	private String telPhoneNumber1;
	private String telPhoneNumber2;
	private String role;
	private Boolean status;
	private Long editorOfCategory;
	private Entity_StoryCategory editorOfCategoryEntity;
	private Set<Entity_Permissions> permissionsList;
	private Entity_Roles userRole;
	private String authenticationToken;
	private Set<Entity_UserReportedStories> reportedStories;
	private Long submittedStories;
	private Long editorialRejected;
	private Long subEditorialRejected;
	private Long publishedStories;
	private Long numberOftoriesSubEditorialIgnored;

	private List<Entity_ReportedStories> submittedStoriesList;
	private List<Entity_ReportedStories> editorialRejectedList;
	private List<Entity_ReportedStories> subEditorialRejectedList;
	private List<Entity_ReportedStories> publishedStoriesList;
	private List<Entity_ReportedStories> numberOftoriesSubEditorialIgnoredList;

	public Long getUserId() {
		return userId;
	}

	public void setUserId(Long userId) {
		this.userId = userId;
	}

	public String getFirstName() {
		return firstName;
	}

	public void setFirstName(String firstName) {
		this.firstName = firstName;
	}

	public String getLastName() {
		return lastName;
	}

	public void setLastName(String lastName) {
		this.lastName = lastName;
	}

	@Basic
	@Column(name = "username", nullable = true, length = -1)
	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public Timestamp getCreatedOn() {
		return createdOn;
	}

	public void setCreatedOn(Timestamp createdOn) {
		this.createdOn = createdOn;
	}

	public String getCreatedBy() {
		return createdBy;
	}

	public void setCreatedBy(String createdBy) {
		this.createdBy = createdBy;
	}

	public Timestamp getUpdatedOn() {
		return updatedOn;
	}

	public void setUpdatedOn(Timestamp updatedOn) {
		this.updatedOn = updatedOn;
	}

	public String getUpdatedBy() {
		return updatedBy;
	}

	public void setUpdatedBy(String updatedBy) {
		this.updatedBy = updatedBy;
	}

	@Basic
	@Column(name = "role_id", nullable = true)
	public Long getRoleId() {
		return roleId;
	}

	public void setRoleId(Long roleId) {
		this.roleId = roleId;
	}

	@Basic
	@Column(name = "id_card_number", nullable = true, length = -1)
	public String getIdCardNumber() {
		return idCardNumber;
	}

	public void setIdCardNumber(String idCardNumber) {
		this.idCardNumber = idCardNumber;
	}

	public String getTelPhoneNumber1() {
		return telPhoneNumber1;
	}

	public void setTelPhoneNumber1(String telPhoneNumber1) {
		this.telPhoneNumber1 = telPhoneNumber1;
	}

	public String getTelPhoneNumber2() {
		return telPhoneNumber2;
	}

	public void setTelPhoneNumber2(String telPhoneNumber2) {
		this.telPhoneNumber2 = telPhoneNumber2;
	}

	public String getRole() {
		return role;
	}

	public void setRole(String role) {
		this.role = role;
	}

	public Boolean getStatus() {
		return status;
	}

	public void setStatus(Boolean status) {
		this.status = status;
	}

	public Set<Entity_Permissions> getPermissionsList() {
		return permissionsList;
	}

	public void setPermissionsList(Set<Entity_Permissions> permissionsList) {
		this.permissionsList = permissionsList;
	}

	public String getAuthenticationToken() {
		return authenticationToken;
	}

	public void setAuthenticationToken(String authenticationToken) {
		this.authenticationToken = authenticationToken;
	}

	@OneToMany(mappedBy = "user_reported_stories")
	public Set<Entity_UserReportedStories> getReportedStories() {
		return reportedStories;
	}

	public void setReportedStories(Set<Entity_UserReportedStories> reportedStories) {
		this.reportedStories = reportedStories;
	}

	public Entity_Roles getUserRole() {
		return userRole;
	}

	public void setUserRole(Entity_Roles userRole) {
		this.userRole = userRole;
	}

	public Long getEditorOfCategory() {
		return editorOfCategory;
	}

	public void setEditorOfCategory(Long editorOfCategory) {
		this.editorOfCategory = editorOfCategory;
	}

	public Entity_StoryCategory getEditorOfCategoryEntity() {
		return editorOfCategoryEntity;
	}

	public void setEditorOfCategoryEntity(Entity_StoryCategory editorOfCategoryEntity) {
		this.editorOfCategoryEntity = editorOfCategoryEntity;
	}

	public Long getSubmittedStories() {
		return submittedStories;
	}

	public void setSubmittedStories(Long submittedStories) {
		this.submittedStories = submittedStories;
	}

	public Long getEditorialRejected() {
		return editorialRejected;
	}

	public void setEditorialRejected(Long editorialRejected) {
		this.editorialRejected = editorialRejected;
	}

	public Long getPublishedStories() {
		return publishedStories;
	}

	public void setPublishedStories(Long publishedStories) {
		this.publishedStories = publishedStories;
	}

	public Long getSubEditorialRejected() {
		return subEditorialRejected;
	}

	public void setSubEditorialRejected(Long subEditorialRejected) {
		this.subEditorialRejected = subEditorialRejected;
	}

	public Long getNumberOftoriesSubEditorialIgnored() {
		return numberOftoriesSubEditorialIgnored;
	}

	public void setNumberOftoriesSubEditorialIgnored(Long numberOftoriesSubEditorialIgnored) {
		this.numberOftoriesSubEditorialIgnored = numberOftoriesSubEditorialIgnored;
	}

	@Override
	public boolean equals(Object o) {
		if (this == o)
			return true;
		if (o == null || getClass() != o.getClass())
			return false;

		Entity_Users that = (Entity_Users) o;

		if (userId != null ? !userId.equals(that.userId) : that.userId != null)
			return false;

		if (firstName != null ? !firstName.equals(that.firstName) : that.firstName != null)
			return false;
		if (lastName != null ? !lastName.equals(that.lastName) : that.lastName != null)
			return false;
		if (username != null ? !username.equals(that.username) : that.username != null)
			return false;
		if (password != null ? !password.equals(that.password) : that.password != null)
			return false;
		if (createdOn != null ? !createdOn.equals(that.createdOn) : that.createdOn != null)
			return false;
		if (createdBy != null ? !createdBy.equals(that.createdBy) : that.createdBy != null)
			return false;
		if (updatedOn != null ? !updatedOn.equals(that.updatedOn) : that.updatedOn != null)
			return false;
		if (updatedBy != null ? !updatedBy.equals(that.updatedBy) : that.updatedBy != null)
			return false;
		if (roleId != null ? !roleId.equals(that.roleId) : that.roleId != null)
			return false;
		if (role != null ? !role.equals(that.role) : that.role != null)
			return false;
		if (status != null ? !status.equals(that.status) : that.status != null)
			return false;
		if (idCardNumber != null ? !idCardNumber.equals(that.idCardNumber) : that.idCardNumber != null)
			return false;
		if (telPhoneNumber1 != null ? !telPhoneNumber1.equals(that.telPhoneNumber1) : that.telPhoneNumber1 != null)
			return false;
		if (telPhoneNumber2 != null ? !telPhoneNumber2.equals(that.telPhoneNumber2) : that.telPhoneNumber2 != null)
			return false;
		if (permissionsList != null ? !permissionsList.equals(that.permissionsList) : that.permissionsList != null)
			return false;
		if (reportedStories != null ? !reportedStories.equals(that.reportedStories) : that.reportedStories != null)
			return false;
		if (userRole != null ? !userRole.equals(that.userRole) : that.userRole != null)
			return false;
		if (editorOfCategory != null ? !editorOfCategory.equals(that.editorOfCategory) : that.editorOfCategory != null)
			return false;
		if (authenticationToken != null ? !authenticationToken.equals(that.authenticationToken)
				: that.authenticationToken != null)
			return false;
		if (editorOfCategoryEntity != null ? !editorOfCategoryEntity.equals(that.editorOfCategoryEntity)
				: that.editorOfCategoryEntity != null)
			return false;
		if (submittedStories != null ? !submittedStories.equals(that.submittedStories) : that.submittedStories != null)
			return false;
		if (editorialRejected != null ? !editorialRejected.equals(that.editorialRejected)
				: that.editorialRejected != null)
			return false;
		if (publishedStories != null ? !publishedStories.equals(that.publishedStories) : that.publishedStories != null)
			return false;
		if (subEditorialRejected != null ? !subEditorialRejected.equals(that.subEditorialRejected)
				: that.subEditorialRejected != null)
			return false;

		if (numberOftoriesSubEditorialIgnored != null
				? !numberOftoriesSubEditorialIgnored.equals(that.numberOftoriesSubEditorialIgnored)
				: that.numberOftoriesSubEditorialIgnored != null)
			return false;

		if (submittedStoriesList != null ? !submittedStoriesList.equals(that.submittedStoriesList)
				: that.submittedStoriesList != null)
			return false;

		if (editorialRejectedList != null ? !editorialRejectedList.equals(that.editorialRejectedList)
				: that.editorialRejectedList != null)
			return false;

		if (publishedStoriesList != null ? !publishedStoriesList.equals(that.publishedStoriesList)
				: that.publishedStoriesList != null)
			return false;

		if (subEditorialRejectedList != null ? !subEditorialRejectedList.equals(that.subEditorialRejectedList)
				: that.subEditorialRejectedList != null)
			return false;

		if (numberOftoriesSubEditorialIgnoredList != null
				? !numberOftoriesSubEditorialIgnoredList.equals(that.numberOftoriesSubEditorialIgnoredList)
				: that.numberOftoriesSubEditorialIgnoredList != null)
			return false;
		return true;
	}

	@Override
	public int hashCode() {
		int result = userId != null ? userId.hashCode() : 0;
		result = 31 * result + (firstName != null ? firstName.hashCode() : 0);
		result = 31 * result + (lastName != null ? lastName.hashCode() : 0);
		result = 31 * result + (username != null ? username.hashCode() : 0);
		result = 31 * result + (password != null ? password.hashCode() : 0);
		result = 31 * result + (createdOn != null ? createdOn.hashCode() : 0);
		result = 31 * result + (createdBy != null ? createdBy.hashCode() : 0);
		result = 31 * result + (updatedOn != null ? updatedOn.hashCode() : 0);
		result = 31 * result + (updatedBy != null ? updatedBy.hashCode() : 0);
		result = 31 * result + (roleId != null ? roleId.hashCode() : 0);
		result = 31 * result + (role != null ? role.hashCode() : 0);
		result = 31 * result + (status != null ? status.hashCode() : 0);
		result = 31 * result + (idCardNumber != null ? idCardNumber.hashCode() : 0);
		result = 31 * result + (telPhoneNumber1 != null ? telPhoneNumber1.hashCode() : 0);
		result = 31 * result + (telPhoneNumber2 != null ? telPhoneNumber2.hashCode() : 0);
		result = 31 * result + (permissionsList != null ? permissionsList.hashCode() : 0);
		result = 31 * result + (reportedStories != null ? reportedStories.hashCode() : 0);
		result = 31 * result + (userRole != null ? userRole.hashCode() : 0);
		result = 31 * result + (authenticationToken != null ? authenticationToken.hashCode() : 0);
		result = 31 * result + (editorOfCategory != null ? editorOfCategory.hashCode() : 0);
		result = 31 * result + (editorOfCategoryEntity != null ? editorOfCategoryEntity.hashCode() : 0);
		result = 31 * result + (submittedStories != null ? submittedStories.hashCode() : 0);
		result = 31 * result + (editorialRejected != null ? editorialRejected.hashCode() : 0);
		result = 31 * result + (publishedStories != null ? publishedStories.hashCode() : 0);
		result = 31 * result + (subEditorialRejected != null ? subEditorialRejected.hashCode() : 0);
		result = 31 * result
				+ (numberOftoriesSubEditorialIgnored != null ? numberOftoriesSubEditorialIgnored.hashCode() : 0);
		result = 31 * result + (submittedStoriesList != null ? submittedStoriesList.hashCode() : 0);
		result = 31 * result + (editorialRejectedList != null ? editorialRejectedList.hashCode() : 0);
		result = 31 * result + (publishedStoriesList != null ? publishedStoriesList.hashCode() : 0);
		result = 31 * result + (subEditorialRejectedList != null ? subEditorialRejectedList.hashCode() : 0);
		result = 31 * result
				+ (numberOftoriesSubEditorialIgnoredList != null ? numberOftoriesSubEditorialIgnoredList.hashCode()
						: 0);
		return result;
	}

	public List<Entity_ReportedStories> getSubmittedStoriesList() {
		return submittedStoriesList;
	}

	public void setSubmittedStoriesList(List<Entity_ReportedStories> submittedStoriesList) {
		this.submittedStoriesList = submittedStoriesList;
	}

	public List<Entity_ReportedStories> getEditorialRejectedList() {
		return editorialRejectedList;
	}

	public void setEditorialRejectedList(List<Entity_ReportedStories> editorialRejectedList) {
		this.editorialRejectedList = editorialRejectedList;
	}

	public List<Entity_ReportedStories> getSubEditorialRejectedList() {
		return subEditorialRejectedList;
	}

	public void setSubEditorialRejectedList(List<Entity_ReportedStories> subEditorialRejectedList) {
		this.subEditorialRejectedList = subEditorialRejectedList;
	}

	public List<Entity_ReportedStories> getPublishedStoriesList() {
		return publishedStoriesList;
	}

	public void setPublishedStoriesList(List<Entity_ReportedStories> publishedStoriesList) {
		this.publishedStoriesList = publishedStoriesList;
	}

	public List<Entity_ReportedStories> getNumberOftoriesSubEditorialIgnoredList() {
		return numberOftoriesSubEditorialIgnoredList;
	}

	public void setNumberOftoriesSubEditorialIgnoredList(
			List<Entity_ReportedStories> numberOftoriesSubEditorialIgnoredList) {
		this.numberOftoriesSubEditorialIgnoredList = numberOftoriesSubEditorialIgnoredList;
	}

}
