package com.monitor.editorial.entities;

import java.sql.Timestamp;
import java.util.List;

import javax.persistence.Entity;
import javax.persistence.Table;

@Entity
@Table(name = "book_pages", schema = "public", catalog = "postgres")
public class Entity_SubEditedPages {

	private Long subEditedPageId;
	private Long bookPageId;
	private Long subEdtitorId;
	private Long cheifSubId;
	private Boolean cheifSubApprovalStatus;
	private Timestamp approvalDate;
	private Timestamp subEditedDate;
	private String fileName;
	private String fileContent;
	private Boolean prePressReceived;
	private String subEditedPagesRef;
	private Entity_Users subEditor;
	private Entity_Users cheifSubEditor;
	private Entity_Users prePressReceiver;
	private Entity_BookPages bookPage;


	@Override
	public boolean equals(Object o) {
		if (this == o)
			return true;
		if (o == null || getClass() != o.getClass())
			return false;
		Entity_SubEditedPages that = (Entity_SubEditedPages) o;
		if (subEditedPageId != null ? !subEditedPageId.equals(that.subEditedPageId) : that.subEditedPageId != null)
			return false;
		if (bookPageId != null ? !bookPageId.equals(that.bookPageId) : that.bookPageId != null)
			return false;
		if (subEdtitorId != null ? !subEdtitorId.equals(that.subEdtitorId) : that.subEdtitorId != null)
			return false;
		if (cheifSubId != null ? !cheifSubId.equals(that.cheifSubId) : that.cheifSubId
				!= null)
			return false;
		if (cheifSubApprovalStatus != null ? !cheifSubApprovalStatus.equals(that.cheifSubApprovalStatus)
				: that.cheifSubApprovalStatus != null)
			return false;
		if (approvalDate != null ? !approvalDate.equals(that.approvalDate) : that.approvalDate != null)
			return false;
		if (subEditor != null ? !subEditor.equals(that.subEditor) : that.subEditor != null)
			return false;
		if (cheifSubEditor != null ? !cheifSubEditor.equals(that.cheifSubEditor)
				: that.cheifSubEditor != null)
			return false;
		if (prePressReceiver != null ? !prePressReceiver.equals(that.prePressReceiver)
				: that.prePressReceiver != null)
			return false;
		if (bookPage != null ? !bookPage.equals(that.bookPage)
				: that.bookPage != null)
			return false;
		return true;
	}
	
	@Override
	public int hashCode() {
		int result = subEditedPageId != null ? subEditedPageId.hashCode() : 0;
		result = 31 * result + (bookPageId != null ? bookPageId.hashCode() : 0);
		result = 31 * result + (subEdtitorId != null ? subEdtitorId.hashCode() : 0);
		result = 31 * result + (cheifSubId != null ? cheifSubId.hashCode() : 0);
		result = 31 * result + (cheifSubApprovalStatus != null ? cheifSubApprovalStatus.hashCode() : 0);
		result = 31 * result + (approvalDate != null ? approvalDate.hashCode() : 0);
		result = 31 * result + (subEditedDate != null ? subEditedDate.hashCode() : 0);
		result = 31 * result + (subEditor != null ? subEditor.hashCode() : 0);
		result = 31 * result + (cheifSubEditor != null ? cheifSubEditor.hashCode() : 0);
		result = 31 * result + (prePressReceiver != null ? prePressReceiver.hashCode() : 0);
		result = 31 * result + (bookPage != null ? bookPage.hashCode() : 0);
		return result;
	}

	public Long getSubEditedPageId() {
		return subEditedPageId;
	}

	public void setSubEditedPageId(Long subEditedPageId) {
		this.subEditedPageId = subEditedPageId;
	}

	public Long getBookPageId() {
		return bookPageId;
	}

	public void setBookPageId(Long bookPageId) {
		this.bookPageId = bookPageId;
	}

	public Long getSubEdtitorId() {
		return subEdtitorId;
	}

	public void setSubEdtitorId(Long subEdtitorId) {
		this.subEdtitorId = subEdtitorId;
	}

	public Long getCheifSubId() {
		return cheifSubId;
	}

	public void setCheifSubId(Long cheifSubId) {
		this.cheifSubId = cheifSubId;
	}

	public Boolean getCheifSubApprovalStatus() {
		return cheifSubApprovalStatus;
	}

	public void setCheifSubApprovalStatus(Boolean cheifSubApprovalStatus) {
		this.cheifSubApprovalStatus = cheifSubApprovalStatus;
	}

	public Timestamp getApprovalDate() {
		return approvalDate;
	}

	public void setApprovalDate(Timestamp approvalDate) {
		this.approvalDate = approvalDate;
	}

	public Timestamp getSubEditedDate() {
		return subEditedDate;
	}

	public void setSubEditedDate(Timestamp subEditedDate) {
		this.subEditedDate = subEditedDate;
	}

	public String getFileName() {
		return fileName;
	}

	public void setFileName(String fileName) {
		this.fileName = fileName;
	}

	public String getFileContent() {
		return fileContent;
	}

	public void setFileContent(String fileContent) {
		this.fileContent = fileContent;
	}

	public Boolean getPrePressReceived() {
		return prePressReceived;
	}

	public void setPrePressReceived(Boolean prePressReceived) {
		this.prePressReceived = prePressReceived;
	}

	public String getSubEditedPagesRef() {
		return subEditedPagesRef;
	}

	public void setSubEditedPagesRef(String subEditedPagesRef) {
		this.subEditedPagesRef = subEditedPagesRef;
	}

	public Entity_Users getCheifSubEditor() {
		return cheifSubEditor;
	}

	public void setCheifSubEditor(Entity_Users cheifSubEditor) {
		this.cheifSubEditor = cheifSubEditor;
	}

	public Entity_Users getPrePressReceiver() {
		return prePressReceiver;
	}

	public void setPrePressReceiver(Entity_Users prePressReceiver) {
		this.prePressReceiver = prePressReceiver;
	}

	public Entity_Users getSubEditor() {
		return subEditor;
	}

	public void setSubEditor(Entity_Users subEditor) {
		this.subEditor = subEditor;
	}

	public Entity_BookPages getBookPage() {
		return bookPage;
	}

	public void setBookPage(Entity_BookPages bookPage) {
		this.bookPage = bookPage;
	}

}

