package com.monitor.editorial.entities;

import javax.persistence.*;
import java.sql.Date;
import java.sql.Timestamp;
import java.util.Arrays;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "edited_stories", schema = "public", catalog = "postgres")
public class Entity_EditedStories {
	private Long eStoryId;
	private String refNumber;
	private Long reportedStoryId;
	private Long editedBy;
	private Timestamp dateEdited;
	private String storyName;
	private String storyContent;
	private Long storyCategoryId;
	private String subEditorStoryContentVersion;
	private String storyCategory;
	
	private Boolean chiefEditorSeen;
	private Long pageNumberId;
	private Boolean subEdited;
	private Boolean subEditorSeen;
	
	private Long storySubEditorialApproval;
	private Timestamp chiefSubToSubAssignmentDate;
	private Long subEditorUserId;
	private Long subEditorApproval;
	private Timestamp dateOfSubApprovalStatus;
	private Timestamp dateChiefOfSubApprovalStatus;
	
	private Entity_ReportedStories originalStory;
	private Entity_BookPages bookPage;
	private Entity_Users storyEditor;
	private Entity_Users storySubEditor;
	private Set<Entity_UserReportedStories> storyReporters;
	private Set<Entity_ReportedStoryFiles> storyFiles;
	private List<Entity_SubEditorStoryVersion> subEditorStoryVersionsList;

	public Long geteStoryId() {
		return eStoryId;
	}

	public void seteStoryId(Long eStoryId) {
		this.eStoryId = eStoryId;
	}

	public String getRefNumber() {
		return refNumber;
	}

	public void setRefNumber(String refNumber) {
		this.refNumber = refNumber;
	}

	public Long getReportedStoryId() {
		return reportedStoryId;
	}

	public void setReportedStoryId(Long reportedStoryId) {
		this.reportedStoryId = reportedStoryId;
	}

	public Long getEditedBy() {
		return editedBy;
	}

	public void setEditedBy(Long editedBy) {
		this.editedBy = editedBy;
	}

	public Timestamp getDateEdited() {
		return dateEdited;
	}

	public void setDateEdited(Timestamp dateEdited) {
		this.dateEdited = dateEdited;
	}

	public String getStoryName() {
		return storyName;
	}

	public void setStoryName(String storyName) {
		this.storyName = storyName;
	}

	public String getStoryContent() {
		return storyContent;
	}

	public void setStoryContent(String storyContent) {
		this.storyContent = storyContent;
	}

	public Long getStoryCategoryId() {
		return storyCategoryId;
	}

	public void setStoryCategoryId(Long storyCategoryId) {
		this.storyCategoryId = storyCategoryId;
	}

	public String getStoryCategory() {
		return storyCategory;
	}

	public void setStoryCategory(String storyCategory) {
		this.storyCategory = storyCategory;
	}

	public Entity_ReportedStories getOriginalStory() {
		return originalStory;
	}

	public void setOriginalStory(Entity_ReportedStories originalStory) {
		this.originalStory = originalStory;
	}

	public Boolean getChiefEditorSeen() {
		return chiefEditorSeen;
	}

	public void setChiefEditorSeen(Boolean chiefEditorSeen) {
		this.chiefEditorSeen = chiefEditorSeen;
	}

	public Boolean getSubEdited() {
		return subEdited;
	}

	public void setSubEdited(Boolean subEdited) {
		this.subEdited = subEdited;
	}

	public Boolean getSubEditorSeen() {
		return subEditorSeen;
	}

	public void setSubEditorSeen(Boolean subEditorSeen) {
		this.subEditorSeen = subEditorSeen;
	}

	public Set<Entity_UserReportedStories> getStoryReporters() {
		return storyReporters;
	}

	public void setStoryReporters(Set<Entity_UserReportedStories> storyReporters) {
		this.storyReporters = storyReporters;
	}

	public Long getPageNumberId() {
		return pageNumberId;
	}

	public void setPageNumberId(Long pageNumberId) {
		this.pageNumberId = pageNumberId;
	}

	public Entity_BookPages getPage() {
		return bookPage;
	}

	public void setPage(Entity_BookPages bookPage) {
		this.bookPage = bookPage;
	}

	public Set<Entity_ReportedStoryFiles> getStoryFiles() {
		return storyFiles;
	}

	public void setStoryFiles(Set<Entity_ReportedStoryFiles> storyFiles) {
		this.storyFiles = storyFiles;
	}

	public List<Entity_SubEditorStoryVersion> getSubEditorStoryVersionsList() {
		return subEditorStoryVersionsList;
	}

	public void setSubEditorStoryVersionsList(List<Entity_SubEditorStoryVersion> subEditorStoryVersionsList) {
		this.subEditorStoryVersionsList = subEditorStoryVersionsList;
	}

	public Long getStorySubEditorialApproval() {
		return storySubEditorialApproval;
	}

	public void setStorySubEditorialApproval(Long storySubEditorialApproval) {
		this.storySubEditorialApproval = storySubEditorialApproval;
	}

	public Timestamp getChiefSubToSubAssignmentDate() {
		return chiefSubToSubAssignmentDate;
	}

	public void setChiefSubToSubAssignmentDate(Timestamp chiefSubToSubAssignmentDate) {
		this.chiefSubToSubAssignmentDate = chiefSubToSubAssignmentDate;
	}

	public Long getSubEditorApproval() {
		return subEditorApproval;
	}

	public void setSubEditorApproval(Long subEditorApproval) {
		this.subEditorApproval = subEditorApproval;
	}

	public Long getSubEditorUserId() {
		return subEditorUserId;
	}

	public void setSubEditorUserId(Long subEditorUserId) {
		this.subEditorUserId = subEditorUserId;
	}

	public Timestamp getDateOfSubApprovalStatus() {
		return dateOfSubApprovalStatus;
	}

	public void setDateOfSubApprovalStatus(Timestamp dateOfSubApprovalStatus) {
		this.dateOfSubApprovalStatus = dateOfSubApprovalStatus;
	}

	public Timestamp getDateChiefOfSubApprovalStatus() {
		return dateChiefOfSubApprovalStatus;
	}

	public void setDateChiefOfSubApprovalStatus(Timestamp dateChiefOfSubApprovalStatus) {
		this.dateChiefOfSubApprovalStatus = dateChiefOfSubApprovalStatus;
	}

	public Entity_Users getStoryEditor() {
		return storyEditor;
	}

	public void setStoryEditor(Entity_Users storyEditor) {
		this.storyEditor = storyEditor;
	}

	@Override
	public boolean equals(Object o) {
		if (this == o)
			return true;
		if (o == null || getClass() != o.getClass())
			return false;

		Entity_EditedStories that = (Entity_EditedStories) o;

		if (eStoryId != null ? !eStoryId.equals(that.eStoryId) : that.eStoryId != null)
			return false;
		if (refNumber != null ? !refNumber.equals(that.refNumber) : that.refNumber != null)
			return false;
		if (reportedStoryId != null ? !reportedStoryId.equals(that.reportedStoryId) : that.reportedStoryId != null)
			return false;
		if (editedBy != null ? !editedBy.equals(that.editedBy) : that.editedBy != null)
			return false;
		if (dateEdited != null ? !dateEdited.equals(that.dateEdited) : that.dateEdited != null)
			return false;
		if (storyName != null ? !storyName.equals(that.storyName) : that.storyName != null)
			return false;
		if (storyContent != null ? !storyContent.equals(that.storyContent) : that.storyContent != null)
			return false;
		if (storyCategoryId != null ? !storyCategoryId.equals(that.storyCategoryId) : that.storyCategoryId != null)
			return false;
		if (storyCategory != null ? !storyCategory.equals(that.storyCategory) : that.storyCategory != null)
			return false;
		if (originalStory != null ? !originalStory.equals(that.originalStory) : that.originalStory != null)
			return false;
		if (chiefEditorSeen != null ? !chiefEditorSeen.equals(that.chiefEditorSeen) : that.chiefEditorSeen != null)
			return false;
		if (bookPage != null ? !bookPage.equals(that.bookPage) : that.bookPage != null)
			return false;
		if (pageNumberId != null ? !pageNumberId.equals(that.pageNumberId) : that.pageNumberId != null)
			return false;
		if (subEdited != null ? !subEdited.equals(that.subEdited) : that.subEdited != null)
			return false;
		if (subEditorSeen != null ? !subEditorSeen.equals(that.subEditorSeen) : that.subEditorSeen != null)
			return false;
		if (storyReporters != null ? !storyReporters.equals(that.storyReporters) : that.storyReporters != null)
			return false;
		if (storyFiles != null ? !storyFiles.equals(that.storyFiles) : that.storyFiles != null)
			return false;
		if (subEditorStoryVersionsList != null ? !subEditorStoryVersionsList.equals(that.subEditorStoryVersionsList)
				: that.subEditorStoryVersionsList != null)
			return false;
		if (storySubEditorialApproval != null ? !storySubEditorialApproval.equals(that.storySubEditorialApproval)
				: that.storySubEditorialApproval != null)
			return false;
		if (chiefSubToSubAssignmentDate != null ? !chiefSubToSubAssignmentDate.equals(that.chiefSubToSubAssignmentDate)
				: that.chiefSubToSubAssignmentDate != null)
			return false;
		if (subEditorUserId != null ? !subEditorUserId.equals(that.subEditorUserId) : that.subEditorUserId != null)
			return false;
		if (subEditorApproval != null ? !subEditorApproval.equals(that.subEditorApproval)
				: that.subEditorApproval != null)
			return false;
		if (dateChiefOfSubApprovalStatus != null
				? !dateChiefOfSubApprovalStatus.equals(that.dateChiefOfSubApprovalStatus)
				: that.dateChiefOfSubApprovalStatus != null)
			return false;
		if (dateOfSubApprovalStatus != null ? !dateOfSubApprovalStatus.equals(that.dateOfSubApprovalStatus)
				: that.dateOfSubApprovalStatus != null)
			return false;
		if (storyEditor != null ? !storyEditor.equals(that.storyEditor) : that.storyEditor != null)
			return false;
		if (storySubEditor != null ? !storySubEditor.equals(that.storySubEditor) : that.storySubEditor != null)
			return false;
		return true;
	}

	@Override
	public int hashCode() {
		int result = eStoryId != null ? eStoryId.hashCode() : 0;
		result = 31 * result + (refNumber != null ? refNumber.hashCode() : 0);
		result = 31 * result + (reportedStoryId != null ? reportedStoryId.hashCode() : 0);
		result = 31 * result + (editedBy != null ? editedBy.hashCode() : 0);
		result = 31 * result + (dateEdited != null ? dateEdited.hashCode() : 0);
		result = 31 * result + (storyName != null ? storyName.hashCode() : 0);
		result = 31 * result + (storyContent != null ? storyContent.hashCode() : 0);
		result = 31 * result + (storyCategoryId != null ? storyCategoryId.hashCode() : 0);
		result = 31 * result + (storyCategory != null ? storyCategory.hashCode() : 0);
		result = 31 * result + (originalStory != null ? originalStory.hashCode() : 0);
		result = 31 * result + (chiefEditorSeen != null ? chiefEditorSeen.hashCode() : 0);
		result = 31 * result + (pageNumberId != null ? pageNumberId.hashCode() : 0);
		result = 31 * result + (bookPage != null ? bookPage.hashCode() : 0);
		result = 31 * result + (subEdited != null ? subEdited.hashCode() : 0);
		result = 31 * result + (subEditorSeen != null ? subEditorSeen.hashCode() : 0);
		result = 31 * result + (storyReporters != null ? storyReporters.hashCode() : 0);
		result = 31 * result + (storyFiles != null ? storyFiles.hashCode() : 0);
		result = 31 * result + (subEditorStoryVersionsList != null ? subEditorStoryVersionsList.hashCode() : 0);
		result = 31 * result + (storySubEditorialApproval != null ? storySubEditorialApproval.hashCode() : 0);
		result = 31 * result + (chiefSubToSubAssignmentDate != null ? chiefSubToSubAssignmentDate.hashCode() : 0);
		result = 31 * result + (subEditorUserId != null ? subEditorUserId.hashCode() : 0);
		result = 31 * result + (subEditorApproval != null ? subEditorApproval.hashCode() : 0);
		result = 31 * result + (dateChiefOfSubApprovalStatus != null ? dateChiefOfSubApprovalStatus.hashCode() : 0);
		result = 31 * result + (dateOfSubApprovalStatus != null ? dateOfSubApprovalStatus.hashCode() : 0);
		result = 31 * result + (storyEditor != null ? storyEditor.hashCode() : 0);
		result = 31 * result + (storySubEditor != null ? storySubEditor.hashCode() : 0);
		return result;
	}

	public Entity_Users getStorySubEditor() {
		return storySubEditor;
	}

	public void setStorySubEditor(Entity_Users storySubEditor) {
		this.storySubEditor = storySubEditor;
	}

	public String getSubEditorStoryContentVersion() {
		return subEditorStoryContentVersion;
	}

	public void setSubEditorStoryContentVersion(String subEditorStoryContentVersion) {
		this.subEditorStoryContentVersion = subEditorStoryContentVersion;
	}

}
