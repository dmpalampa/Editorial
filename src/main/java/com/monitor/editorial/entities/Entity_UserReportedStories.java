package com.monitor.editorial.entities;

import java.sql.Timestamp;

import javax.persistence.*;

@Entity
@Table(name = "user_reported_stories", schema = "public", catalog = "postgres")
public class Entity_UserReportedStories {
	private Long id;
	private Long storyId;
	private Long userId;
	private Entity_Users user;
	private Entity_ReportedStories story;
	private Long addedBy;
	private Timestamp dateSubmitted;

	@Basic
	@Column(name = "id", nullable = true)
	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	@Basic
	@Column(name = "s_story_id", nullable = true)
	public Long getStoryId() {
		return storyId;
	}

	public void setStoryId(Long storyId) {
		this.storyId = storyId;
	}

	@Basic
	@Column(name = "user_id", nullable = true)
	public Long getUserId() {
		return userId;
	}

	public void setUserId(Long userId) {
		this.userId = userId;
	}

	
	public Entity_Users getUser() {
		return user;
	}

	public void setUser(Entity_Users user) {
		this.user = user;
	}


	public Entity_ReportedStories getStory() {
		return story;
	}

	public void setStory(Entity_ReportedStories story) {
		this.story = story;
	}
	
	@Basic
	@Column(name = "date_submitted", nullable = true)
	public Timestamp getDateSubmitted() {
		return dateSubmitted;
	}

	public void setDateSubmitted(Timestamp dateSubmitted) {
		this.dateSubmitted = dateSubmitted;
	}


	@Override
	public boolean equals(Object o) {
		if (this == o)
			return true;
		if (o == null || getClass() != o.getClass())
			return false;

		Entity_UserReportedStories that = (Entity_UserReportedStories) o;
		if (id != null ? !id.equals(that.id) : that.id != null)
			return false;
		if (storyId != null ? !storyId.equals(that.storyId) : that.storyId != null)
			return false;
		if (userId != null ? !userId.equals(that.userId) : that.userId != null)
			return false;
		if (user != null ? !user.equals(that.user) : that.user != null)
			return false;
		if (story != null ? !story.equals(that.story) : that.story != null)
			return false;
		if (addedBy != null ? !addedBy.equals(that.addedBy) : that.story != null)
			return false;
		if (dateSubmitted != null ? !dateSubmitted.equals(that.dateSubmitted) : that.dateSubmitted != null)
			return false;
		return true;
	}

	@Override
	public int hashCode() {
		int result = id != null ? id.hashCode() : 0;
		result = 31 * result + (storyId != null ? storyId.hashCode() : 0);
		result = 31 * result + (userId != null ? userId.hashCode() : 0);
		result = 31 * result + (user != null ? user.hashCode() : 0);
		result = 31 * result + (story != null ? story.hashCode() : 0);
		result = 31 * result + (addedBy != null ? addedBy.hashCode() : 0);
		result = 31 * result + (dateSubmitted != null ? dateSubmitted.hashCode() : 0);
		return result;
	}

	public Long getAddedBy() {
		return addedBy;
	}

	public void setAddedBy(Long addedBy) {
		this.addedBy = addedBy;
	}

}
