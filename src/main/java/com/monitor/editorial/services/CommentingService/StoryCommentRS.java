package com.monitor.editorial.services.CommentingService;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.monitor.editorial.Core.DauCentralException;
import com.monitor.editorial.Core.GenericResponse;
import com.monitor.editorial.entities.Entity_EditedStories;
import com.monitor.editorial.entities.Entity_Permissions;
import com.monitor.editorial.entities.Entity_ReportedStories;
import com.monitor.editorial.entities.Entity_ReportedStoryFiles;
import com.monitor.editorial.entities.Entity_Roles;
import com.monitor.editorial.entities.Entity_StoryCategory;
import com.monitor.editorial.entities.Entity_StoryComments;
import com.monitor.editorial.entities.Entity_UserReportedStories;
import com.monitor.editorial.entities.Entity_Users;
import com.monitor.editorial.services.LocalCoreObject;

public class StoryCommentRS extends LocalCoreObject {

	public GenericResponse CommentService(JSONObject o, String request) {

		if (request.equals("saveComment")) {
			return saveComment(o);
		}
		if (request.equals("getAllCommentsByStoryId")) {
			return getAllCommentsByStoryId(o);
		}
		return null;
	}

	private GenericResponse saveComment(JSONObject o) {

		List<Entity_StoryComments> cList = new ArrayList<Entity_StoryComments>();
		Long storyId = o.getLong("storyId");
		Long userId = o.getLong("userId");
		try {
			if (storyId == null && userId == null)
				throw new DauCentralException("Can't comment on un identified story");
			Entity_StoryComments c = new Entity_StoryComments();
			c.setDate(getCurrentTimeStamp());
			c.setComment(o.getString("comment"));
			c.setReportedStoryId(o.getLong("reportedStoryId"));
			c.setUsername(o.getString("userName"));
			c.setUserId(o.getLong("userId"));
			c.setStoryOwer(o.getBoolean("storyOwer"));

			if (!saveEntity(c))
				throw new DauCentralException("Failed to add comment");
			cList.add(c);
			return new GenericResponse(0, "comment added sucessgully", cList);

		} catch (Exception e) {
			e.printStackTrace();
			return new GenericResponse(99, "Failed to add comment", null);
		}
	}
	

	private GenericResponse getAllCommentsByStoryId(JSONObject o) {
		Long storyId = o.getLong("storyId");
		Entity_ReportedStories rs = null;
		List<Entity_StoryComments> cList = new ArrayList<Entity_StoryComments>();
		try {
			if (storyId == null)
				throw new DauCentralException("Can't get comments for un identified story");

			rs = (Entity_ReportedStories) getEntityById(Entity_ReportedStories.class, storyId).getReturnObject();

			if (rs != null)
				
				cList = (List<Entity_StoryComments>) getManyEntitiesByField(Entity_StoryComments.class,
						"reportedStoryId", storyId);
			
			/*
			 * Set<Entity_StoryComments> comments = new
			 * HashSet<Entity_StoryComments>(cList); rs.setComments(comments);
			 */

			return new GenericResponse(0, "Story comments", rs);
		} catch (Exception e) {
			e.printStackTrace();
			return new GenericResponse(99, "Failed to add comment", null);
		}
	}
}
