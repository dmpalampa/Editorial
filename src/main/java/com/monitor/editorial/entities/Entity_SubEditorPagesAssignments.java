package com.monitor.editorial.entities;

import java.sql.Timestamp;
import java.util.List;

import javax.persistence.Entity;
import javax.persistence.Table;

@Entity
@Table(name = "sub_editor_page_assignments", schema = "public", catalog = "postgres")
public class Entity_SubEditorPagesAssignments {

	private Long id;
	private Long pageNumberId;
	private Long subEditorUserId;
	private Long chiefSubEditorUserId;
	private Long eStoryId;
	private Timestamp dateAssigned;
	private Entity_BookPages page;
	private Entity_Users subEditor;
	private  Entity_EditedStories storyAssigenedToPage;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Long getPageNumberId() {
		return pageNumberId;
	}

	public void setPageNumberId(Long pageNumberId) {
		this.pageNumberId = pageNumberId;
	}

	public Long getSubEditorUserId() {
		return subEditorUserId;
	}

	public void setSubEditorUserId(Long subEditorUserId) {
		this.subEditorUserId = subEditorUserId;
	}

	public Long getChiefSubEditorUserId() {
		return chiefSubEditorUserId;
	}

	public void setChiefSubEditorUserId(Long chiefSubEditorUserId) {
		this.chiefSubEditorUserId = chiefSubEditorUserId;
	}

	public Timestamp getDateAssigned() {
		return dateAssigned;
	}

	public void setDateAssigned(Timestamp dateAssigned) {
		this.dateAssigned = dateAssigned;
	}

	public Entity_Users getSubEditor() {
		return subEditor;
	}

	public void setSubEditor(Entity_Users subEditor) {
		this.subEditor = subEditor;
	}

	public Long geteStoryId() {
		return eStoryId;
	}

	public void seteStoryId(Long eStoryId) {
		this.eStoryId = eStoryId;
	}

	public Entity_BookPages getPage() {
		return page;
	}

	public void setPage(Entity_BookPages page) {
		this.page = page;
	}

	public Entity_EditedStories getStoryAssigenedToPage() {
		return storyAssigenedToPage;
	}

	public void setStoryAssigenedToPage(Entity_EditedStories storyAssigenedToPage) {
		this.storyAssigenedToPage = storyAssigenedToPage;
	}
	
	@Override
	public boolean equals(Object o) {
		if (this == o)
			return true;
		if (o == null || getClass() != o.getClass())
			return false;

		Entity_SubEditorPagesAssignments that = (Entity_SubEditorPagesAssignments) o;
		if (id != null ? !id.equals(that.id) : that.id != null)
			return false;
		if (pageNumberId != null ? !pageNumberId.equals(that.pageNumberId) : that.pageNumberId != null)
			return false;
		if (subEditorUserId != null ? !subEditorUserId.equals(that.subEditorUserId) : that.subEditorUserId != null)
			return false;
		if (chiefSubEditorUserId != null ? !chiefSubEditorUserId.equals(that.chiefSubEditorUserId)
				: that.chiefSubEditorUserId != null)
			return false;
		if (dateAssigned != null ? !dateAssigned.equals(that.dateAssigned) : that.dateAssigned != null)
			return false;
		if (subEditor != null ? !subEditor.equals(that.subEditor) : that.subEditor != null)
			return false;
		if (eStoryId != null ? !eStoryId.equals(that.eStoryId) : that.eStoryId != null)
			return false;
		if (storyAssigenedToPage != null ? !storyAssigenedToPage.equals(that.storyAssigenedToPage) : that.storyAssigenedToPage != null)
			return false;
		return true;
	}

	@Override
	public int hashCode() {
		int result = id != null ? id.hashCode() : 0;
		result = 31 * result + (pageNumberId != null ? pageNumberId.hashCode() : 0);
		result = 31 * result + (subEditorUserId != null ? subEditorUserId.hashCode() : 0);
		result = 31 * result + (chiefSubEditorUserId != null ? chiefSubEditorUserId.hashCode() : 0);
		result = 31 * result + (dateAssigned != null ? dateAssigned.hashCode() : 0);
		result = 31 * result + (subEditor != null ? subEditor.hashCode() : 0);
		result = 31 * result + (eStoryId != null ? eStoryId.hashCode() : 0);
		result = 31 * result + (storyAssigenedToPage != null ? storyAssigenedToPage.hashCode() : 0);
		return result;
	}



}
