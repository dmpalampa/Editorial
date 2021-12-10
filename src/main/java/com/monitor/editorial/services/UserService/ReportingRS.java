package com.monitor.editorial.services.UserService;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
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
import com.monitor.editorial.entities.Entity_SubEditorStoryVersion;
import com.monitor.editorial.entities.Entity_UserReportedStories;
import com.monitor.editorial.entities.Entity_Users;
import com.monitor.editorial.services.LocalCoreObject;

public class ReportingRS extends LocalCoreObject {

	public GenericResponse UserService(JSONObject o, String request) {

		if (request.equals("saveStory"))
			return saveStory(o);

		if (request.equals("saveStoryFiles"))
			return saveStoryFiles(o);

		if (request.equals("getAllStories"))
			return getAllStories();

		if (request.equals("getStoriesForOneReporter"))
			return getStoriesForOneReporter(o);

		if (request.equals("getStoryCategory"))
			return getStoryCategory();

		if (request.equals("saveOrUpdateStoryCategory"))
			return saveOrUpdateStoryCategory(o);

		if (request.equals("getStoryById"))
			return getStoryById(o);

		if (request.equals("unTagStoryOwners"))
			return unTagStoryOwners(o);

		if (request.equals("deleteStoryFile"))
			return deleteStoryFile(o);

		if (request.equals("getEditedStoriesByCategoryIdEditorIdAndDate"))
			return getEditedStoriesByCategoryIdEditorIdAndDate(o);

		if (request.equals("getEditedStoryByStoryId"))
			return getEditedStoryByStoryId(o);

		if (request.equals("getReportedStoriesByDateAndReporterId"))
			return getReportedStoriesByDateAndReporterId(o);

		return null;
	}

	private GenericResponse saveStory(JSONObject o) {
		Entity_ReportedStories reportedStory = null;
		List<Entity_ReportedStories> reportedStoriesList = new ArrayList<Entity_ReportedStories>();
		JSONObject story = o.getJSONObject("story");
		Long storyId = story.getLong("storyId");
		Long addedBy = story.getLong("addedBy");
		String storyTitle = story.getString("storyTitle");
		String storyContent = story.getString("storyContent");
		JSONArray storyCategoryEditors = story.getJSONArray("storyCategoryEditors");
		String mailSubject = "";
		try {
			if (storyTitle.equals("") || storyTitle == null)
				return new GenericResponse(2, "Story Title is missing", null);

			if (storyContent.equals("") || storyContent == null)
				return new GenericResponse(2, "Story Content is missing", null);

			if (storyId != null) {
				reportedStory = (Entity_ReportedStories) getEntityById(Entity_ReportedStories.class, storyId)
						.getReturnObject();
				Entity_ReportedStories rs = null;
				if (reportedStory != null)
					rs = (Entity_ReportedStories) getOneEntityByField(Entity_ReportedStories.class, "storyTitle",
							storyTitle);

				if (rs != null)
					if (!rs.getStoryId().equals(reportedStory.getStoryId()))
						return new GenericResponse(2, "Story with such a Title  already exists.", null);

				reportedStory.setUpdatedOn(getCurrentTimeStamp());
				reportedStory.setUpdateVersion(reportedStory.getUpdateVersion() + 1);

			} else {
				reportedStory = (Entity_ReportedStories) getOneEntityByField(Entity_ReportedStories.class, "storyTitle",
						storyTitle);
				if (reportedStory != null)
					return new GenericResponse(2, "Story with such a Title  already exists.", null);

				reportedStory = new Entity_ReportedStories();
				reportedStory.setDateSubmitted(getCurrentTimeStamp());
				reportedStory.setUpdateVersion(0L);
				reportedStory.setEditorSeen(false);
				
			}
			reportedStory.setStoryTitle(storyTitle);
			reportedStory.setStoryCategoryId(story.getLong("storyCategoryId"));
			reportedStory.setStoryCategory(story.getString("storyCategory"));
			reportedStory.setStoryContent(storyContent);
			reportedStory.setEdited(false);
			reportedStory.setApprovalStatus(false);
			reportedStory.setEditorialApproval(0L);

			// reportedStory.setStorySource(o.getString("storySource"));
			if (!saveEntity(reportedStory))
				return new GenericResponse(99, "Failed to saved succesfully", null);

			JSONArray reporters = story.getJSONArray("storyReporters");

			JSONArray userIds = new JSONArray();

			String reporterNames = "";
			for (Object r : reporters) {
				JSONObject reporter = (JSONObject) r;
				Long userId = reporter.getLong("userId");
				userIds.add(userId);

				if (reporterNames == "")
					reporterNames = reporterNames + reporter.getString("firstName") + " and "
							+ reporter.getString("lastName");

				if (reporterNames != "")
					reporterNames = reporterNames + reporter.getString("firstName") + " "
							+ reporter.getString("lastName");

				JSONObject secondLastReporter = null;

				if (reporters.size() > 2) {
					reporterNames = reporterNames + " ,";
					secondLastReporter = (JSONObject) reporters.get(reporters.size() - 2);
					if (secondLastReporter != null)
						reporterNames = reporterNames + " and ";
				}
			}

			if (reporters != null)
				if (reporters.size() > 0) {
					// JSONObject reporterId = reporters.getLong("userId");
					JSONObject jsonString = new JSONObject();
					jsonString.put("storyId", reportedStory.getStoryId());
					jsonString.put("userIds", userIds);
					jsonString.put("addedBy", addedBy);
					reportedStory.setStoryReporters(assignStoryOwners(jsonString));
				}

			if (o.getString("editedBy") != null) {
				mailSubject = "Reporter(s) has/have edited an existing story";
				System.out.println((o.getString("editedBy")));
			}

			if (o.getString("addedBy") != null)
				mailSubject = " Has/have submited a new story to your category";

			if (storyCategoryEditors != null)
				if (storyCategoryEditors.size() > 0)
					for (Object ob : storyCategoryEditors) {
						JSONObject _ob = (JSONObject) ob;
						String editorsEmail = _ob.getString("username");
						sendEmailNotification(
								editorsEmail, "Reporters are " + reporterNames.toUpperCase() + "\n By "
										+ o.getString("editedBy") + "\n" + storyContent.replaceAll("\\<[^>]*>", ""),
								mailSubject.toUpperCase());
					}

			reportedStoriesList.add(reportedStory);
			return new GenericResponse(0, "story saved sucessgully", reportedStoriesList);
		} catch (Exception e) {
			e.printStackTrace();
			return new GenericResponse(99, "Failed to save story", null);
		}
	}

	private Set<Entity_UserReportedStories> assignStoryOwners(JSONObject o) {
		Long storyId = o.getLong("storyId");
		JSONArray userIds = o.getJSONArray("userIds");
		Long addedBy = o.getLong("addedBy");
		Entity_UserReportedStories u_reportedStory = null;
		List<Entity_UserReportedStories> u_reportedStoryList = new ArrayList<Entity_UserReportedStories>();

		try {
			if (storyId == null && addedBy == null)
				throw new DauCentralException("Can't allocate reporters to unknow story");
			for (Object id : userIds) {

				if (id != null) {
					u_reportedStoryList = (List<Entity_UserReportedStories>) getEntityList(
							"From Entity_UserReportedStories where userId=" + id + " and storyId=" + storyId + "")
									.getReturnObject();
					if (u_reportedStoryList == null || u_reportedStoryList.size() <= 0) {

						u_reportedStory = new Entity_UserReportedStories();
						u_reportedStory.setStoryId(storyId);
						u_reportedStory.setUserId(Long.parseLong(id.toString()));
						u_reportedStory.setAddedBy(addedBy);
						u_reportedStory.setDateSubmitted(getCurrentTimeStamp());
						if (!saveEntity(u_reportedStory))
							throw new DauCentralException("failed to assign story to the owners");
						u_reportedStoryList.add(u_reportedStory);
					}
				}
			}
			Set<Entity_UserReportedStories> set = new HashSet<Entity_UserReportedStories>(u_reportedStoryList);
			return set;
		} catch (DauCentralException e) {
			e.printStackTrace();
			return null;
		}
	}

	private GenericResponse saveStoryFiles(JSONObject o) {
		List<Entity_ReportedStoryFiles> fileList = new ArrayList<Entity_ReportedStoryFiles>();
		List<Entity_ReportedStoryFiles> filesListReturn = new ArrayList<Entity_ReportedStoryFiles>();

		Entity_ReportedStoryFiles file = null;
		Long storyId = o.getLong("storyId");
		JSONArray files = o.getJSONArray("storyFiles");

		try {
			if (storyId == null)
				throw new DauCentralException("Can't add files to unknow story");
			for (Object ob : files) {
				JSONObject job = new JSONObject();
				job = (JSONObject) ob;
				file = new Entity_ReportedStoryFiles();
				file.setStoryId(storyId);
				file.setFileContent(job.getString("fileContent"));
				file.setFileName(job.getString("fileName"));
				file.setFileType(job.getString("fileType"));

				if (saveEntity(file))
					filesListReturn.add(file);
			}
			if (filesListReturn.size() <= 0)
				throw new DauCentralException("Failed save all uploaded files. Contact admin for help");

			filesListReturn.clear();
			filesListReturn = getStoryFiles(storyId);

			return new GenericResponse(0, "story edited version saved sucessfully", filesListReturn);
		} catch (DauCentralException e) {
			e.printStackTrace();
			return new GenericResponse(0, "Errors occured while uploading file(s)", fileList);
		}
	}

	private GenericResponse getReportedStoriesByDateAndReporterId(JSONObject o) {
		List<Entity_ReportedStories> reportedStoriesListToReturn = new ArrayList<Entity_ReportedStories>();
		List<Entity_ReportedStories> reportedStoriesList = new ArrayList<Entity_ReportedStories>();
		List<Entity_UserReportedStories> uReportedStories = new ArrayList<Entity_UserReportedStories>();
		String date = "";
		String d_ = "";
		JSONArray dateRangeValues = o.getJSONArray("dateRangeValues");
		Long reporterId = o.getLong("reporterId");

		try {
			if (dateRangeValues == null)
				return new GenericResponse(99, "Supply date(s) and try again", null);
			if (dateRangeValues.size() <= 0)
				return new GenericResponse(99, "Supply date(s) and try again", null);

			if (reporterId == null)
				throw new DauCentralException("Can't get stories for un identified reporter");

			List<String> d = new ArrayList<String>();
			for (Object od : dateRangeValues) {
				date = (String) od;
				d.add(date);
			}

			if (d.get(1) == null) {
				uReportedStories = (List<Entity_UserReportedStories>) getEntityList(
						"From Entity_UserReportedStories where userId =" + reporterId
								+ " and to_char(dateSubmitted ,'YYYY-MM-DD')= '" + d.get(0) + "'").getReturnObject();
			} else {
				uReportedStories = (List<Entity_UserReportedStories>) getEntityList(
						"From Entity_UserReportedStories where userId =" + reporterId
								+ " and to_char(dateSubmitted ,'YYYY-MM-DD') between  '" + d.get(0) + "' and '"
								+ d.get(1) + "'").getReturnObject();
			}

			for (Entity_UserReportedStories ur : uReportedStories) {
				Entity_ReportedStories rs = (Entity_ReportedStories) getEntityById(Entity_ReportedStories.class,
						ur.getStoryId()).getReturnObject();
				if (rs != null)
					reportedStoriesList.add(rs);
			}

			if (reportedStoriesList == null)
				return new GenericResponse(0, "no stories found", null);

			for (Entity_ReportedStories rs : reportedStoriesList) {

				Set<Entity_UserReportedStories> ownersSet = new HashSet<Entity_UserReportedStories>(
						getStoryOwners(rs.getStoryId()));

				Set<Entity_ReportedStoryFiles> storyFiles = new HashSet<Entity_ReportedStoryFiles>(
						getStoryFiles(rs.getStoryId()));

				List<Entity_StoryComments> comments = (List<Entity_StoryComments>) getEntityList(
						"select c From Entity_StoryComments c where reportedStoryId=" + rs.getStoryId()
								+ " order by c.date DESC").getReturnObject();

				Entity_Users editor = null;
				if (rs.getEditedBy() != null) {
					editor = (Entity_Users) getEntityById(Entity_Users.class, rs.getEditedBy()).getReturnObject();
					if (editor != null)
						rs.setEditor(editor);
				}

				rs.setComments(comments);
				rs.setStoryCategoryEntity(getStoryCategoryById(rs.getStoryCategoryId()));
				rs.setStoryReporters(ownersSet);
				rs.setStoryFiles(storyFiles);

				reportedStoriesListToReturn.add(rs);
			}

			return new GenericResponse(0, "stories", reportedStoriesListToReturn);
		} catch (DauCentralException e) {
			e.printStackTrace();
			return new GenericResponse(99, "Errors occured while fetching stories", null);
		}
	}

	private GenericResponse deleteStoryFile(JSONObject o) {
		Entity_ReportedStoryFiles file = null;
		Long fileId = o.getLong("fileId");
		try {
			if (fileId == null)
				throw new DauCentralException("Can't delete un identified file");
			file = (Entity_ReportedStoryFiles) getEntityById(Entity_ReportedStoryFiles.class, fileId).getReturnObject();

			if (file == null)
				throw new DauCentralException("File not found");
			if (!deleteEntity(file))
				throw new DauCentralException("Error occured while delting story file");
			return new GenericResponse(0, "Story deleted succefully", null);
		} catch (DauCentralException e) {
			e.printStackTrace();
			return new GenericResponse(99, "Error occured while delting story file", null);
		}
	}

	private GenericResponse getEditedStoryByStoryId(JSONObject o) {
		Entity_EditedStories editedStory = null;
		List<Entity_EditedStories> editedStoriesList = new ArrayList<Entity_EditedStories>();

		Long storyId = o.getLong("storyId");

		try {
			if (storyId == null)
				throw new DauCentralException("Can't get un identfied story, contact admin for help");
			editedStory = (Entity_EditedStories) getEntityById(Entity_EditedStories.class, storyId).getReturnObject();

			if (editedStory == null)
				throw new DauCentralException("Edited story not found");
			editedStory.setOriginalStory(getReportedStoryById(editedStory.getReportedStoryId()));
			editedStoriesList.add(editedStory);

			return new GenericResponse(0, "story edited version saved sucessfully", editedStoriesList);

		} catch (DauCentralException e) {
			e.printStackTrace();
			return new GenericResponse(99, "Error occured while getting stories", null);
		}
	}

	private GenericResponse getStoriesForOneReporter(JSONObject o) {

		Long reporterId = o.getLong("reporterId");
		Entity_UserReportedStories urs = null;
		List<Entity_ReportedStories> rsList = null;
		try {
			if (reporterId == null)
				throw new DauCentralException("User not specified");
			urs = getOneEntityByField(Entity_UserReportedStories.class, "uReporter", reporterId);

			if (urs == null)
				throw new DauCentralException("No Story Categories found");

			rsList = (List<Entity_ReportedStories>) getEntityList(
					"From Entity_ReportedStories where storyId =" + urs.getStoryId()).getReturnObject();
			if (rsList == null)
				throw new DauCentralException("No Stories found");
			return new GenericResponse(0, "User reported stories", rsList);
		} catch (DauCentralException e) {
			e.printStackTrace();
			return new GenericResponse(99, "Error occured while getting stories", null);
		}
	}

	private GenericResponse getStoryCategory() {
		List<Entity_StoryCategory> catList = null;
		List<Entity_Users> catgoryEditorsList = new ArrayList<Entity_Users>();
		List<Entity_StoryCategory> catListToReturn = new ArrayList<Entity_StoryCategory>();
		try {
			catList = (List<Entity_StoryCategory>) getEntityList("From Entity_StoryCategory").getReturnObject();
			if (catList == null || catList.size() <= 0)
				throw new DauCentralException("No Story Categories found");

			if (catList != null)
				for (Entity_StoryCategory sc : catList) {
					catgoryEditorsList = getManyEntitiesByField(Entity_Users.class, "editorOfCategory",
							sc.getsCategoryId());
					Entity_Users supervisor = null;
					if (sc.getSupervisor() != null)
						supervisor = (Entity_Users) getEntityById(Entity_Users.class, sc.getSupervisor())
								.getReturnObject();

					if (supervisor != null)
						sc.setSupervisorInCharge(supervisor);

					Set<Entity_Users> set = new HashSet<Entity_Users>(catgoryEditorsList);
					sc.setCategoryEditors(set);
					catListToReturn.add(sc);
				}
			return new GenericResponse(0, "Story Categories", catListToReturn);
		} catch (DauCentralException e) {
			e.printStackTrace();
			return new GenericResponse(99, "Error occured while get story categories", null);
		}
	}

	private GenericResponse saveOrUpdateStoryCategory(JSONObject o) {

		List<Entity_StoryCategory> categoryList = new ArrayList<Entity_StoryCategory>();
		JSONArray catArray = o.getJSONArray("category");
		Entity_StoryCategory category = null;
		List<Entity_StoryCategory> savedCategoryList = new ArrayList<Entity_StoryCategory>();
		try {
			for (int i = 0; i < catArray.size(); i++) {

				JSONObject ob = new JSONObject();
				ob = (JSONObject) catArray.get(i);
				Long categoryId = ob.getLong("sCategoryId");
				String categoryName = ob.getString("categoryName");

				if (categoryName == "" && ob.getLong("supervisorId") == null)
					throw new DauCentralException("Can't add category without a name or a supervisor");

				if (categoryId != null) {
					category = (Entity_StoryCategory) getEntityById(Entity_StoryCategory.class, categoryId)
							.getReturnObject();

					Entity_StoryCategory c = getOneEntityByField(Entity_StoryCategory.class, "categoryName",
							categoryName);

					if (category != null && c != null)
						if (!c.getsCategoryId().equals(category.getsCategoryId()))
							throw new DauCentralException("category with such a name already exists.");
				} else {
					Entity_StoryCategory c = getOneEntityByField(Entity_StoryCategory.class, "categoryName",
							categoryName);
					if (c != null)
						throw new DauCentralException("category with such a name already exists.");

					category = new Entity_StoryCategory();

				}
				category.setCategoryName(ob.getString("categoryName"));
				category.setDescription(ob.getString("description"));
				category.setSupervisor(ob.getLong("supervisorId"));
				category.setCreatedOn(getCurrentTimeStamp());
				if (!saveEntity(category))
					return new GenericResponse(99, "failed to story category", category.getCategoryName());
				savedCategoryList.add(category);
			}

			if (savedCategoryList.size() > 0)
				return new GenericResponse(0, "story category added sucessgully", savedCategoryList);

			return new GenericResponse(99, "failed to story category", null);

		} catch (DauCentralException e) {
			e.printStackTrace();
			return new GenericResponse(99, "failed to save user story category" + e, null);
		}
	}

	private GenericResponse getStoryById(JSONObject ob) {
		List<Entity_ReportedStories> reportedStoriesList = new ArrayList<Entity_ReportedStories>();
		Entity_ReportedStories reportedStory = null;
		Long storyId = ob.getLong("storyId");
		try {
			if (storyId == null)
				throw new DauCentralException("Unidentified story cant be edited! contact admin for help");
			reportedStory = (Entity_ReportedStories) getEntityById(Entity_ReportedStories.class, storyId)
					.getReturnObject();

			if (reportedStory == null)
				return new GenericResponse(99, "Such story not doesnt exist! Contact admin for help", null);

			Set<Entity_UserReportedStories> set = new HashSet<Entity_UserReportedStories>(
					getStoryOwners(reportedStory.getStoryId()));

			Set<Entity_ReportedStoryFiles> storyFiles = new HashSet<Entity_ReportedStoryFiles>(
					getStoryFiles(reportedStory.getStoryId()));

			List<Entity_StoryComments> comments = (List<Entity_StoryComments>) getEntityList(
					"select c From Entity_StoryComments c where reportedStoryId=" + reportedStory.getStoryId()
							+ " order by c.date DESC").getReturnObject();

			reportedStory.setComments(comments);
			reportedStory.setStoryCategoryEntity(getStoryCategoryById(reportedStory.getStoryCategoryId()));
			reportedStory.setStoryReporters(set);
			reportedStory.setStoryFiles(storyFiles);
			reportedStoriesList.add(reportedStory);

			return new GenericResponse(0, "story", reportedStoriesList);
		} catch (DauCentralException e) {
			e.printStackTrace();
			return new GenericResponse(99, "Errors occured while fetching story to edit", null);
		}
	}

	private Entity_StoryCategory getStoryCategoryById(Long catId) {
		Entity_StoryCategory storyCat = new Entity_StoryCategory();
		List<Entity_StoryCategory> catList = null;
		List<Entity_Users> catgoryEditorsList = new ArrayList<Entity_Users>();
		List<Entity_StoryCategory> catListToReturn = new ArrayList<Entity_StoryCategory>();
		try {

			if (catId == null)
				throw new DauCentralException("can't get story category un identified");
			storyCat = (Entity_StoryCategory) getEntityById(Entity_StoryCategory.class, catId).getReturnObject();

			catgoryEditorsList = getManyEntitiesByField(Entity_Users.class, "editorOfCategory",
					storyCat.getsCategoryId());

			Entity_Users supervisor = null;
			if (storyCat.getSupervisor() != null)
				supervisor = (Entity_Users) getEntityById(Entity_Users.class, storyCat.getSupervisor())
						.getReturnObject();

			if (supervisor != null)
				storyCat.setSupervisorInCharge(supervisor);

			Set<Entity_Users> set = new HashSet<Entity_Users>(catgoryEditorsList);
			storyCat.setCategoryEditors(set);

			return storyCat;
		} catch (DauCentralException e) {
			e.printStackTrace();
			return null;
		}
	}

	private GenericResponse getAllStories() {
		List<Entity_ReportedStories> reportedStoriesList = new ArrayList<Entity_ReportedStories>();
		List<Entity_ReportedStories> reportedStoriesListToReturn = new ArrayList<Entity_ReportedStories>();
		try {
			reportedStoriesList = (List<Entity_ReportedStories>) getEntityList("From Entity_ReportedStories")
					.getReturnObject();

			if (reportedStoriesList == null || reportedStoriesList.size() <= 0)
				return new GenericResponse(0, "No user roles found", null);

			for (Entity_ReportedStories rs : reportedStoriesList) {
				Set<Entity_UserReportedStories> set = new HashSet<Entity_UserReportedStories>(
						getStoryOwners(rs.getStoryId()));

				Set<Entity_ReportedStoryFiles> storyFiles = new HashSet<Entity_ReportedStoryFiles>(
						getStoryFiles(rs.getStoryId()));

				rs.setStoryCategoryEntity(getStoryCategoryById(rs.getStoryCategoryId()));
				rs.setStoryReporters(set);
				rs.setStoryFiles(storyFiles);

				reportedStoriesListToReturn.add(rs);
			}

			return new GenericResponse(0, "stories", reportedStoriesListToReturn);
		} catch (Exception e) {
			e.printStackTrace();
			return new GenericResponse(99, "Errors occured while fetching stories", null);
		}
	}

	private Entity_ReportedStories getReportedStoryById(Long storyId) {
		Entity_ReportedStories reportedStory = null;
		try {
			if (storyId == null)
				throw new DauCentralException("Can't find un identified story");
			reportedStory = (Entity_ReportedStories) getEntityById(Entity_ReportedStories.class, storyId)
					.getReturnObject();
			if (reportedStory == null)
				throw new DauCentralException("No story found");

			Set<Entity_UserReportedStories> set = new HashSet<Entity_UserReportedStories>(
					getStoryOwners(reportedStory.getStoryId()));

			Set<Entity_ReportedStoryFiles> storyFiles = new HashSet<Entity_ReportedStoryFiles>(
					getStoryFiles(reportedStory.getStoryId()));

			reportedStory.setStoryCategoryEntity(getStoryCategoryById(reportedStory.getStoryCategoryId()));
			reportedStory.setStoryReporters(set);
			reportedStory.setStoryFiles(storyFiles);
			// sendEmailNotification();

			return reportedStory;
		} catch (DauCentralException e) {
			e.printStackTrace();
			return null;
		}
	}

	private GenericResponse getEditedStoriesByCategoryIdEditorIdAndDate(JSONObject o) {
		Long userId = o.getLong("userId");
		Entity_ReportedStories rs = null;
		List<Entity_EditedStories> eList = new ArrayList<Entity_EditedStories>();
		List<Entity_EditedStories> eListToReturn = new ArrayList<Entity_EditedStories>();
		List<Entity_ReportedStories> reportedStoriesList = new ArrayList<Entity_ReportedStories>();
		List<Entity_ReportedStories> reportedStoriesListToReturn = new ArrayList<Entity_ReportedStories>();
		String reportersStringList = "";

		Long storyCategoryId = o.getLong("storyCategoryId");

		String date = "";
		String d_ = "";
		JSONArray dateRangeValues = o.getJSONArray("dateRangeValues");

		try {
			if (dateRangeValues == null)
				return new GenericResponse(99, "Supply date(s) and try again", null);
			if (dateRangeValues.size() <= 0)
				return new GenericResponse(99, "Supply date(s) and try again", null);

			if (userId == null)
				return new GenericResponse(2, "Can't get stories for un identified editor", null);
			List<String> d = new ArrayList<String>();
			for (Object od : dateRangeValues) {
				date = (String) od;
				d.add(date);
			}

			if (d.get(1) == null) {
				if (storyCategoryId != null)
					reportedStoriesList = (List<Entity_ReportedStories>) getEntityList(
							"From Entity_ReportedStories where storyCategoryId=" + storyCategoryId
									+ " and (to_char(lastEditedDate,'YYYY-MM-DD')= '" + d.get(0)
									+ "' or to_char(dateOfEditorialApprovalStatus,'YYYY-MM-DD')= '" + d.get(0)
									+ "') and editorialApproval=1 order by storyId desc").getReturnObject();
			} else {
				reportedStoriesList = (List<Entity_ReportedStories>) getEntityList(
						"From Entity_ReportedStories where storyCategoryId=" + storyCategoryId
								+ " and (to_char(lastEditedDate ,'YYYY-MM-DD') between  '" + d.get(0) + "' and '"
								+ d.get(1) + "' or to_char(dateOfEditorialApprovalStatus ,'YYYY-MM-DD') between  '"
								+ d.get(0) + "' and '" + d.get(1) + "') and editorialApproval=1 order by storyId desc")
										.getReturnObject();
			}
			if (reportedStoriesList != null)
				for (Entity_ReportedStories rStory : reportedStoriesList) {
					eList = (List<Entity_EditedStories>) getEntityList("From Entity_EditedStories where editedBy="
							+ userId + " and reportedStoryId =" + rStory.getStoryId() + " order by eStoryId desc")
									.getReturnObject();

					Set<Entity_UserReportedStories> set = new HashSet<Entity_UserReportedStories>(
							getStoryOwners(rStory.getStoryId()));
					for (Entity_UserReportedStories urs : set) {
						Entity_Users user = urs.getUser();
						if (user != null)
							reportersStringList = reportersStringList + user.getUsername() + " " + user.getLastName()
									+ " " + user.getFirstName() + ",";
					}

					List<Entity_StoryComments> comments = (List<Entity_StoryComments>) getEntityList(
							"select c From Entity_StoryComments c where reportedStoryId=" + rStory.getStoryId()
									+ " order by c.date DESC").getReturnObject();
					if (rStory.getEditedBy() != null) {
						Entity_Users editor = (Entity_Users) getEntityById(Entity_Users.class, rStory.getEditedBy())
								.getReturnObject();
						rStory.setEditor(editor);
					}

					rStory.setComments(comments);
					rStory.setReporterStringList(reportersStringList);
					reportersStringList = "";

					Set<Entity_ReportedStoryFiles> storyFiles = new HashSet<Entity_ReportedStoryFiles>(
							getStoryFiles(rStory.getStoryId()));
					rStory.setStoryCategoryEntity(getStoryCategoryById(rStory.getStoryCategoryId()));
					rStory.setStoryReporters(set);
					rStory.setStoryFiles(storyFiles);
					rStory.setListEditVersion(eList);
					reportedStoriesListToReturn.add(rStory);
				}
			return new GenericResponse(0, "Edited stories", reportedStoriesListToReturn);
		} catch (Exception e) {
			e.printStackTrace();
			return new GenericResponse(99, "Error ocured while edited stories", null);
		}
	}

	private List<Entity_UserReportedStories> getStoryOwners(Long storyId) {
		List<Entity_UserReportedStories> reporterStoriesList = new ArrayList<Entity_UserReportedStories>();
		List<Entity_UserReportedStories> storyRepotersList = new ArrayList<Entity_UserReportedStories>();
		Entity_Users reporter = new Entity_Users();
		Object obj = new Object();
		try {
			reporterStoriesList = (List<Entity_UserReportedStories>) getEntityList(
					"From Entity_UserReportedStories where storyId =" + storyId).getReturnObject();
			for (Entity_UserReportedStories ur : reporterStoriesList) {
				reporter = (Entity_Users) getEntityById(Entity_Users.class, ur.getUserId()).getReturnObject();
				if (reporter == null)
					throw new DauCentralException(
							"Errors occurred while identifing story owner, please report this to admin");
				ur.setUser(reporter);
				storyRepotersList.add(ur);
			}
			return storyRepotersList;
		} catch (DauCentralException e) {
			e.printStackTrace();
			return null;
		}
	}

	private GenericResponse unTagStoryOwners(JSONObject o) {
		Long storyId = o.getLong("storyId");
		Long userId = o.getLong("userId");
		Long addedBy = o.getLong("addedBy");
		List<Entity_UserReportedStories> reporterStoriesList = new ArrayList<Entity_UserReportedStories>();
		Entity_UserReportedStories reporter = new Entity_UserReportedStories();
		Object obj = new Object();
		try {

			if (userId == null && storyId == null)
				throw new DauCentralException("Failure to relate user with story");

			if (userId != addedBy)
				reporterStoriesList = (List<Entity_UserReportedStories>) getEntityList(
						"From Entity_UserReportedStories where userId=" + userId + " and storyId=" + storyId + "")
								.getReturnObject();

			if (reporterStoriesList != null && reporterStoriesList.size() > 0) {
				reporter = reporterStoriesList.get(0);
				if (!deleteEntity(reporter))
					throw new DauCentralException("Failed to untag user. Please contact admin for assistance");
			}
			reporterStoriesList = getStoryOwners(storyId);

			return new GenericResponse(0, "User untagged successfully", reporterStoriesList);
		} catch (DauCentralException e) {
			e.printStackTrace();
			return new GenericResponse(99, "Errors occured while untaging story owners", null);
		}
	}

	private List<Entity_ReportedStoryFiles> getStoryFiles(Long storyId) {
		List<Entity_ReportedStoryFiles> reporterStoriesList = new ArrayList<Entity_ReportedStoryFiles>();
		Object obj = new Object();
		try {
			reporterStoriesList = (List<Entity_ReportedStoryFiles>) getEntityList(
					"From Entity_ReportedStoryFiles where storyId =" + storyId).getReturnObject();

			return reporterStoriesList;
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}
	}

	private GenericResponse getEditedStoriesByCatAndEditorId(JSONObject o) {
		Long userId = o.getLong("userId");
		Long categoryId = o.getLong("categoryId");
		Entity_EditedStories rs = null;
		List<Entity_EditedStories> eList = new ArrayList<Entity_EditedStories>();
		try {
			if (userId == null)
				throw new DauCentralException("Can't get stories for un identified editor");

			eList = (List<Entity_EditedStories>) getEntityList(
					"From Entity_EditedStories where editedBy=" + userId + " and storyCategoryId=" + categoryId + "")
							.getReturnObject();

			eList = (List<Entity_EditedStories>) getManyEntitiesByField(Entity_EditedStories.class, "editedBy", userId);

			return new GenericResponse(0, "Edited Stories", eList);
		} catch (Exception e) {
			e.printStackTrace();
			return new GenericResponse(99, "Failed retrieve Edited Stories", null);
		}
	}
}
