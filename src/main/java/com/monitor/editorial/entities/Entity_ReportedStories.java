package com.monitor.editorial.entities;

import javax.persistence.*;
import java.sql.Date;
import java.sql.Timestamp;
import java.util.Arrays;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "reported_stories", schema = "public", catalog = "postgres")
public class Entity_ReportedStories {
	private Long storyId;
	private String storyTitle;
	private String storyContent;
	private Timestamp dateSubmitted;
	private Timestamp updatedOn;
	private Long updateVersion;
	private String storySource;
	private Long storyCategoryId;
	private String storyCategory;
	private String reporterStringList;
	private Boolean editorSeen;
	private Boolean approvalStatus;
	private Long storySubEditorialApproval;

	private Long seenBy;
	private Long editedBy;
	private Boolean edited;
	private Long editorialApproval;
	private Set<Entity_UserReportedStories> storyReporters;
	private Set<Entity_ReportedStoryFiles> storyFiles;
	private Entity_StoryCategory storyCategoryEntity;
	private List<Entity_StoryComments> comments;
	private List<Entity_EditedStories> listEditVersion;

	private Entity_Users editor;
	private Timestamp lastEditedDate;

	private Timestamp dateEditorSeen;
	private Timestamp dateSubEditorialApproval;
	private Long editorId;
	private Timestamp dateOfEditorialApprovalStatus;

	@Id
	@Column(name = "story_id", nullable = false)
	public Long getStoryId() {
		return storyId;
	}

	public void setStoryId(Long storyId) {
		this.storyId = storyId;
	}

	@Basic
	@Column(name = "story_title", nullable = true, length = -1)
	public String getStoryTitle() {
		return storyTitle;
	}

	public void setStoryTitle(String storyTitle) {
		this.storyTitle = storyTitle;
	}

	@Basic
	@Column(name = "story_content", nullable = true)
	public String getStoryContent() {
		return storyContent;
	}

	public void setStoryContent(String storyContent) {
		this.storyContent = storyContent;
	}

	@Basic
	@Column(name = "date_submitted", nullable = true)
	public Timestamp getDateSubmitted() {
		return dateSubmitted;
	}

	public void setDateSubmitted(Timestamp dateSubmitted) {
		this.dateSubmitted = dateSubmitted;
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
	@Column(name = "update_version", nullable = true)
	public Long getUpdateVersion() {
		return updateVersion;
	}

	public void setUpdateVersion(Long updateVersion) {
		this.updateVersion = updateVersion;
	}

	@Basic
	@Column(name = "story_source", nullable = true, length = -1)
	public String getStorySource() {
		return storySource;
	}

	public void setStorySource(String storySource) {
		this.storySource = storySource;
	}

	@Basic
	@Column(name = "story_category_id", nullable = true)
	public Long getStoryCategoryId() {
		return storyCategoryId;
	}

	public void setStoryCategoryId(Long storyCategoryId) {
		this.storyCategoryId = storyCategoryId;
	}

	@Basic
	@Column(name = "story_category", nullable = true)
	public String getStoryCategory() {
		return storyCategory;
	}

	public void setStoryCategory(String storyCategory) {
		this.storyCategory = storyCategory;
	}

	@Basic
	@Column(name = "editor_seen", nullable = true)
	public Boolean getEditorSeen() {
		return editorSeen;
	}

	public void setEditorSeen(Boolean editorSeen) {
		this.editorSeen = editorSeen;
	}

	@Basic
	@Column(name = "approval_status", nullable = true)
	public Boolean getApprovalStatus() {
		return approvalStatus;
	}

	public void setApprovalStatus(Boolean approvalStatus) {
		this.approvalStatus = approvalStatus;
	}

	public Boolean getEdited() {
		return edited;
	}

	public void setEdited(Boolean edited) {
		this.edited = edited;
	}

	public Set<Entity_UserReportedStories> getStoryReporters() {
		return storyReporters;
	}

	public void setStoryReporters(Set<Entity_UserReportedStories> storyReporters) {
		this.storyReporters = storyReporters;
	}

	public Set<Entity_ReportedStoryFiles> getStoryFiles() {
		return storyFiles;
	}

	public void setStoryFiles(Set<Entity_ReportedStoryFiles> storyFiles) {
		this.storyFiles = storyFiles;
	}

	public Entity_StoryCategory getStoryCategoryEntity() {
		return storyCategoryEntity;
	}

	public void setStoryCategoryEntity(Entity_StoryCategory storyCategoryEntity) {
		this.storyCategoryEntity = storyCategoryEntity;
	}

	public List<Entity_StoryComments> getComments() {
		return comments;
	}

	public void setComments(List<Entity_StoryComments> comments) {
		this.comments = comments;
	}

	public Long getStorySubEditorialApproval() {
		return storySubEditorialApproval;
	}

	public void setStorySubEditorialApproval(Long storySubEditorialApproval) {
		this.storySubEditorialApproval = storySubEditorialApproval;
	}

	public Long getEditorialApproval() {
		return editorialApproval;
	}

	public void setEditorialApproval(Long editorialApproval) {
		this.editorialApproval = editorialApproval;
	}

	public List<Entity_EditedStories> getListEditVersion() {
		return listEditVersion;
	}

	public void setListEditVersion(List<Entity_EditedStories> listEditVersion) {
		this.listEditVersion = listEditVersion;
	}

	public Timestamp getLastEditedDate() {
		return lastEditedDate;
	}

	public void setLastEditedDate(Timestamp lastEditedDate) {
		this.lastEditedDate = lastEditedDate;
	}

	public String getReporterStringList() {
		return reporterStringList;
	}

	public void setReporterStringList(String reporterStringList) {
		this.reporterStringList = reporterStringList;
	}

	public Timestamp getDateEditorSeen() {
		return dateEditorSeen;
	}

	public void setDateEditorSeen(Timestamp dateEditorSeen) {
		this.dateEditorSeen = dateEditorSeen;
	}

	public Timestamp getDateSubEditorialApproval() {
		return dateSubEditorialApproval;
	}

	public void setDateSubEditorialApproval(Timestamp dateSubEditorialApproval) {
		this.dateSubEditorialApproval = dateSubEditorialApproval;
	}

	@Override
	public boolean equals(Object o) {
		if (this == o)
			return true;
		if (o == null || getClass() != o.getClass())
			return false;

		Entity_ReportedStories that = (Entity_ReportedStories) o;

		if (seenBy != null ? !seenBy.equals(that.seenBy) : that.seenBy != null)
			return false;
		if (editedBy != null ? !editedBy.equals(that.editedBy) : that.editedBy != null)
			return false;
		if (storyId != null ? !storyId.equals(that.storyId) : that.storyId != null)
			return false;
		if (storyTitle != null ? !storyTitle.equals(that.storyTitle) : that.storyTitle != null)
			return false;
		if (storyContent != null ? !storyContent.equals(that.storyContent) : that.storyContent != null)
			return false;
		if (dateSubmitted != null ? !dateSubmitted.equals(that.dateSubmitted) : that.dateSubmitted != null)
			return false;
		if (updatedOn != null ? !updatedOn.equals(that.updatedOn) : that.updatedOn != null)
			return false;
		if (updateVersion != null ? !updateVersion.equals(that.updateVersion) : that.updateVersion != null)
			return false;
		if (editorSeen != null ? !editorSeen.equals(that.editorSeen) : that.editorSeen != null)
			return false;
		if (approvalStatus != null ? !approvalStatus.equals(that.approvalStatus) : that.approvalStatus != null)
			return false;
		if (edited != null ? !edited.equals(that.edited) : that.edited != null)
			return false;
		if (storySource != null ? !storySource.equals(that.storySource) : that.storySource != null)
			return false;
		if (storyCategoryId != null ? !storyCategoryId.equals(that.storyCategoryId) : that.storyCategoryId != null)
			return false;
		if (storyCategory != null ? !storyCategory.equals(that.storyCategory) : that.storyCategory != null)
			return false;
		if (storyReporters != null ? !storyReporters.equals(that.storyReporters) : that.storyReporters != null)
			return false;
		if (storyFiles != null ? !storyFiles.equals(that.storyFiles) : that.storyFiles != null)
			return false;
		if (storyCategoryEntity != null ? !storyCategoryEntity.equals(that.storyCategoryEntity)
				: that.storyCategoryEntity != null)
			return false;
		if (comments != null ? !comments.equals(that.comments) : that.comments != null)
			return false;
		if (storySubEditorialApproval != null ? !storySubEditorialApproval.equals(that.storySubEditorialApproval)
				: that.storySubEditorialApproval != null)
			return false;
		if (editorialApproval != null ? !editorialApproval.equals(that.editorialApproval)
				: that.editorialApproval != null)
			return false;
		if (listEditVersion != null ? !listEditVersion.equals(that.listEditVersion) : that.listEditVersion != null)
			return false;
		if (lastEditedDate != null ? !lastEditedDate.equals(that.lastEditedDate) : that.lastEditedDate != null)
			return false;
		if (reporterStringList != null ? !reporterStringList.equals(that.reporterStringList)
				: that.reporterStringList != null)
			return false;

		if (dateEditorSeen != null ? !dateEditorSeen.equals(that.dateEditorSeen) : that.dateEditorSeen != null)
			return false;
		if (dateSubEditorialApproval != null ? !dateSubEditorialApproval.equals(that.dateSubEditorialApproval)
				: that.dateSubEditorialApproval != null)
			return false;
		if (editorId != null ? !editorId.equals(that.editorId) : that.editorId != null)
			return false;
		if (dateOfEditorialApprovalStatus != null
				? !dateOfEditorialApprovalStatus.equals(that.dateOfEditorialApprovalStatus)
				: that.dateOfEditorialApprovalStatus != null)
			return false;

		if (editor != null ? !editor.equals(that.editor) : that.editor != null)
			return false;

		return true;
	}

	@Override
	public int hashCode() {
		int result = storyId != null ? storyId.hashCode() : 0;
		result = 31 * result + (storyTitle != null ? storyTitle.hashCode() : 0);
		result = 31 * result + (storyContent != null ? storyContent.hashCode() : 0);
		result = 31 * result + (dateSubmitted != null ? dateSubmitted.hashCode() : 0);
		result = 31 * result + (updatedOn != null ? updatedOn.hashCode() : 0);
		result = 31 * result + (updateVersion != null ? updateVersion.hashCode() : 0);
		result = 31 * result + (editorSeen != null ? editorSeen.hashCode() : 0);
		result = 31 * result + (approvalStatus != null ? approvalStatus.hashCode() : 0);
		result = 31 * result + (edited != null ? edited.hashCode() : 0);
		result = 31 * result + (storySource != null ? storySource.hashCode() : 0);
		result = 31 * result + (storyCategoryId != null ? storyCategoryId.hashCode() : 0);
		result = 31 * result + (storyReporters != null ? storyReporters.hashCode() : 0);
		result = 31 * result + (storyCategory != null ? storyCategory.hashCode() : 0);
		result = 31 * result + (storyFiles != null ? storyFiles.hashCode() : 0);
		result = 31 * result + (storyCategoryEntity != null ? storyCategoryEntity.hashCode() : 0);
		result = 31 * result + (comments != null ? comments.hashCode() : 0);
		result = 31 * result + (storySubEditorialApproval != null ? storySubEditorialApproval.hashCode() : 0);
		result = 31 * result + (editorialApproval != null ? editorialApproval.hashCode() : 0);
		result = 31 * result + (listEditVersion != null ? listEditVersion.hashCode() : 0);
		result = 31 * result + (lastEditedDate != null ? lastEditedDate.hashCode() : 0);
		result = 31 * result + (reporterStringList != null ? reporterStringList.hashCode() : 0);
		result = 31 * result + (dateEditorSeen != null ? dateEditorSeen.hashCode() : 0);
		result = 31 * result + (dateSubEditorialApproval != null ? dateSubEditorialApproval.hashCode() : 0);
		result = 31 * result + (editorId != null ? editorId.hashCode() : 0);
		result = 31 * result + (dateOfEditorialApprovalStatus != null ? dateOfEditorialApprovalStatus.hashCode() : 0);
		result = 31 * result + (seenBy != null ? seenBy.hashCode() : 0);
		result = 31 * result + (editedBy != null ? editedBy.hashCode() : 0);
		result = 31 * result + (editor != null ? editor.hashCode() : 0);
		return result;
	}

	public Long getEditorId() {
		return editorId;
	}

	public void setEditorId(Long editorId) {
		this.editorId = editorId;
	}

	public Timestamp getDateOfEditorialApprovalStatus() {
		return dateOfEditorialApprovalStatus;
	}

	public void setDateOfEditorialApprovalStatus(Timestamp dateOfEditorialApprovalStatus) {
		this.dateOfEditorialApprovalStatus = dateOfEditorialApprovalStatus;
	}

	public Long getEditedBy() {
		return editedBy;
	}

	public void setEditedBy(Long editedBy) {
		this.editedBy = editedBy;
	}

	public Long getSeenBy() {
		return seenBy;
	}

	public void setSeenBy(Long seenBy) {
		this.seenBy = seenBy;
	}

	public Entity_Users getEditor() {
		return editor;
	}

	public void setEditor(Entity_Users editor) {
		this.editor = editor;
	}

}
