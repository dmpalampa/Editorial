package com.monitor.editorial.entities;

import javax.persistence.Basic;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;
import java.sql.Timestamp;

@Entity
@Table(name = "story_comments", schema = "public", catalog = "postgres")
public class Entity_StoryComments {
    private Long cId;
    private String comment;
    private Long reportedStoryId;
    private String username;
    private Timestamp date;
    private Long userId;
    private Boolean storyOwer;

    @Basic
    @Column(name = "c_id", nullable = false)
    public Long getcId() {
        return cId;
    }

    public void setcId(Long cId) {
        this.cId = cId;
    }

    @Basic
    @Column(name = "comment", nullable = true, length = -1)
    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    @Basic
    @Column(name = "reported_story_id", nullable = true)
    public Long getReportedStoryId() {
        return reportedStoryId;
    }

    public void setReportedStoryId(Long reportedStoryId) {
        this.reportedStoryId = reportedStoryId;
    }

    @Basic
    @Column(name = "username", nullable = true, length = -1)
    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    @Basic
    @Column(name = "date", nullable = true)
    public Timestamp getDate() {
        return date;
    }

    public void setDate(Timestamp date) {
        this.date = date;
    }

    @Basic
    @Column(name = "user_id", nullable = true)
    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    @Basic
    @Column(name = "story_ower", nullable = true)
    public Boolean getStoryOwer() {
        return storyOwer;
    }

    public void setStoryOwer(Boolean storyOwer) {
        this.storyOwer = storyOwer;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        Entity_StoryComments that = (Entity_StoryComments) o;

        if (cId != null ? !cId.equals(that.cId) : that.cId != null) return false;
        if (comment != null ? !comment.equals(that.comment) : that.comment != null) return false;
        if (reportedStoryId != null ? !reportedStoryId.equals(that.reportedStoryId) : that.reportedStoryId != null)
            return false;
        if (username != null ? !username.equals(that.username) : that.username != null) return false;
        if (date != null ? !date.equals(that.date) : that.date != null) return false;
        if (userId != null ? !userId.equals(that.userId) : that.userId != null) return false;
        if (storyOwer != null ? !storyOwer.equals(that.storyOwer) : that.storyOwer != null) return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = cId != null ? cId.hashCode() : 0;
        result = 31 * result + (comment != null ? comment.hashCode() : 0);
        result = 31 * result + (reportedStoryId != null ? reportedStoryId.hashCode() : 0);
        result = 31 * result + (username != null ? username.hashCode() : 0);
        result = 31 * result + (date != null ? date.hashCode() : 0);
        result = 31 * result + (userId != null ? userId.hashCode() : 0);
        result = 31 * result + (storyOwer != null ? storyOwer.hashCode() : 0);
        return result;
    }
}
