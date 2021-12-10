package com.monitor.editorial.entities;

import java.sql.Timestamp;
import java.util.List;

import javax.persistence.Entity;
import javax.persistence.Table;

@Entity
@Table(name = "book_pages", schema = "public", catalog = "postgres")
public class Entity_BookPages {

	private Long id;
	private String pageNumber;
	private Long createdBy;
	private Timestamp createdOn;
	private Entity_Users subEditor;
	private List<Entity_EditedStories> listOfStoriesToSubEdit;
	private Entity_SubEditorPagesAssignments pageAssignment;
	private List<Entity_SubEditorPagesAssignments> pageAssignmentHistory;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getPageNumber() {
		return pageNumber;
	}

	public void setPageNumber(String pageNumber) {
		this.pageNumber = pageNumber;
	}

	public Long getCreatedBy() {
		return createdBy;
	}

	public void setCreatedBy(Long createdBy) {
		this.createdBy = createdBy;
	}

	public Timestamp getCreatedOn() {
		return createdOn;
	}

	public void setCreatedOn(Timestamp createdOn) {
		this.createdOn = createdOn;
	}

	public List<Entity_EditedStories> getListOfStoriesToSubEdit() {
		return listOfStoriesToSubEdit;
	}

	public void setListOfStoriesToSubEdit(List<Entity_EditedStories> listOfStoriesToSubEdit) {
		this.listOfStoriesToSubEdit = listOfStoriesToSubEdit;
	}

	public Entity_SubEditorPagesAssignments getPageAssignment() {
		return pageAssignment;
	}

	public void setPageAssignment(Entity_SubEditorPagesAssignments pageAssignment) {
		this.pageAssignment = pageAssignment;
	}

	public List<Entity_SubEditorPagesAssignments> getPageAssignmentHistory() {
		return pageAssignmentHistory;
	}

	public void setPageAssignmentHistory(List<Entity_SubEditorPagesAssignments> pageAssignmentHistory) {
		this.pageAssignmentHistory = pageAssignmentHistory;
	}
	public Entity_Users getSubEditor() {
		return subEditor;
	}

	public void setSubEditor(Entity_Users subEditor) {
		this.subEditor = subEditor;
	}

	@Override
	public boolean equals(Object o) {
		if (this == o)
			return true;
		if (o == null || getClass() != o.getClass())
			return false;
		Entity_BookPages that = (Entity_BookPages) o;
		if (id != null ? !id.equals(that.id) : that.id != null)
			return false;
		if (pageNumber != null ? !pageNumber.equals(that.pageNumber) : that.pageNumber != null)
			return false;
		if (createdBy != null ? !createdBy.equals(that.createdBy) : that.createdBy != null)
			return false;
		if (createdOn != null ? !createdOn.equals(that.createdOn) : that.createdOn != null)
			return false;
		if (listOfStoriesToSubEdit != null ? !listOfStoriesToSubEdit.equals(that.listOfStoriesToSubEdit)
				: that.listOfStoriesToSubEdit != null)
			return false;
		if (pageAssignment != null ? !pageAssignment.equals(that.pageAssignment) : that.pageAssignment != null)
			return false;
		if (subEditor != null ? !subEditor.equals(that.subEditor) : that.subEditor != null)
			return false;
		if (pageAssignmentHistory != null ? !pageAssignmentHistory.equals(that.pageAssignmentHistory)
				: that.pageAssignmentHistory != null)
			return false;
		return true;
	}
	
	@Override
	public int hashCode() {
		int result = id != null ? id.hashCode() : 0;
		result = 31 * result + (pageNumber != null ? pageNumber.hashCode() : 0);
		result = 31 * result + (createdBy != null ? createdBy.hashCode() : 0);
		result = 31 * result + (createdOn != null ? createdOn.hashCode() : 0);
		result = 31 * result + (listOfStoriesToSubEdit != null ? listOfStoriesToSubEdit.hashCode() : 0);
		result = 31 * result + (pageAssignment != null ? pageAssignment.hashCode() : 0);
		result = 31 * result + (pageAssignmentHistory != null ? pageAssignmentHistory.hashCode() : 0);
		result = 31 * result + (subEditor != null ? subEditor.hashCode() : 0);
		return result;
	}

}
