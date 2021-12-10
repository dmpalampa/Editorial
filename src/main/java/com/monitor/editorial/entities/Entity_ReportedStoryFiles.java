package com.monitor.editorial.entities;
import javax.persistence.*;
import java.sql.Date;
import java.sql.Timestamp;
import java.util.Arrays;
import java.util.Set;
 
@Entity
@Table(name = "reported_story_files", schema = "public", catalog = "postgres")
public class Entity_ReportedStoryFiles{
    private Long fileId;
    private String fileName;
    private String fileType;
    private String fileContent;
    private Timestamp createdOn;
    private Long storyId;
    private Long createdBy;
    

	public Long getFileId() {
		return fileId;
	}

	public void setFileId(Long fileId) {
		this.fileId = fileId;
	}

	public Long getStoryId() {
		return storyId;
	}

	public void setStoryId(Long storyId) {
		this.storyId = storyId;
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

	public Timestamp getCreatedOn() {
		return createdOn;
	}

	public void setCreatedOn(Timestamp createdOn) {
		this.createdOn = createdOn;
	}

	public Long getCreatedBy() {
		return createdBy;
	}

	public void setCreatedBy(Long createdBy) {
		this.createdBy = createdBy;
	}    
	
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        Entity_ReportedStoryFiles that = (Entity_ReportedStoryFiles) o;

        if (fileId != null ? !fileId.equals(that.fileId) : that.fileId != null) return false;
        if (fileName != null ? ! fileName.equals(that.fileName) : that.fileName != null) return false;
        if (fileContent != null ? !fileContent.equals(that.fileContent) : that.fileContent != null) return false;
        if (createdOn != null ? !createdOn.equals(that.createdOn) : that.createdOn != null) return false;
        if (storyId != null ? !storyId.equals(that.storyId) : that.storyId != null) return false;
        if (createdBy != null ? !createdBy.equals(that.createdBy) : that.createdBy != null)
            return false;
        if (fileType != null ? !fileType.equals(that.fileType) : that.fileType != null)
            return false;
       
        return true;
    }

    @Override
    public int hashCode() {
        int   result = fileId != null ? fileId.hashCode() : 0;
        result = 31 * result + (fileName != null ? fileName.hashCode() : 0);
        result = 31 * result + (fileContent != null ? fileContent.hashCode() : 0);
        result = 31 * result + (createdOn != null ? createdOn.hashCode() : 0);
        result = 31 * result + (storyId != null ? storyId.hashCode() : 0);
        result = 31 * result + (createdBy != null ? createdBy.hashCode() : 0);
        result = 31 * result + (fileType != null ? fileType.hashCode() : 0);
        return result;
    }

	public String getFileType() {
		return fileType;
	}

	public void setFileType(String fileType) {
		this.fileType = fileType;
	}



}
