package com.monitor.editorial.entities;

import java.sql.Timestamp;
import java.util.Set;

import javax.persistence.Entity;
import javax.persistence.Table;

@Entity
@Table(name = "sub_edit_story_version", schema = "public", catalog = "postgres")
public class Entity_SubEditorStoryVersion {

	private Long id;
	private Long editedStoryId;
	private Long subEditorUserId;
	private Long originalStoryId;
	private Timestamp dateEdited;
	private String storyTitle;
	private String storyContent;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Long getEditedStoryId() {
		return editedStoryId;
	}

	public void setEditedStoryId(Long editedStoryId) {
		this.editedStoryId = editedStoryId;
	}
	
	public Long getOriginalStoryId() {
		return originalStoryId;
	}

	public void setOriginalStoryId(Long originalStoryId) {
		this.originalStoryId = originalStoryId;
	}
	
	public Long getSubEditorUserId() {
		return subEditorUserId;
	}

	public void setSubEditorUserId(Long subEditorUserId) {
		this.subEditorUserId = subEditorUserId;
	}

	public Timestamp getDateEdited() {
		return dateEdited;
	}

	public void setDateEdited(Timestamp dateEdited) {
		this.dateEdited = dateEdited;
	}

	public String getStoryTitle() {
		return storyTitle;
	}

	public void setStoryTitle(String storyTitle) {
		this.storyTitle = storyTitle;
	}

	public String getStoryContent() {
		return storyContent;
	}

	public void setStoryContent(String storyContent) {
		this.storyContent = storyContent;
	}

	@Override
	public boolean equals(Object o) {
		if (this == o)
			return true;
		if (o == null || getClass() != o.getClass())
			return false;

		Entity_SubEditorStoryVersion that = (Entity_SubEditorStoryVersion) o;

		if (id != null ? !id.equals(that.id) : that.id != null)
			return false;
		if (editedStoryId != null ? !editedStoryId.equals(that.editedStoryId) : that.editedStoryId != null)
			return false;
		if (dateEdited != null ? !dateEdited.equals(that.dateEdited) : that.dateEdited != null)
			return false;
		if (storyTitle != null ? !storyTitle.equals(that.storyTitle) : that.storyTitle != null)
			return false;
		if (storyContent != null ? !storyContent.equals(that.storyContent) : that.storyContent != null)
			return false;
		if (subEditorUserId != null ? !subEditorUserId.equals(that.subEditorUserId) : that.subEditorUserId != null)
			return false;
		if (originalStoryId != null ? !originalStoryId.equals(that.originalStoryId) : that.originalStoryId != null)
			return false;

		return true;
	}

	@Override
	public int hashCode() {
		int result = id != null ? id.hashCode() : 0;
		result = 31 * result + (editedStoryId != null ? editedStoryId.hashCode() : 0);
		result = 31 * result + (dateEdited != null ? dateEdited.hashCode() : 0);
		result = 31 * result + (storyTitle != null ? storyTitle.hashCode() : 0);
		result = 31 * result + (storyContent != null ? storyContent.hashCode() : 0);
		result = 31 * result + (subEditorUserId != null ? subEditorUserId.hashCode() : 0);
		result = 31 * result + (originalStoryId != null ? originalStoryId.hashCode() : 0);
		return result;
	}
}
