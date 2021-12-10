package com.monitor.editorial.services.UserService;

import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.monitor.editorial.Core.DauCentralException;
import com.monitor.editorial.Core.GenericResponse;
import com.monitor.editorial.entities.Entity_BookPages;
import com.monitor.editorial.entities.Entity_EditedStories;
import com.monitor.editorial.entities.Entity_ReportedStories;
import com.monitor.editorial.entities.Entity_ReportedStoryFiles;
import com.monitor.editorial.entities.Entity_StoryCategory;
import com.monitor.editorial.entities.Entity_StoryComments;
import com.monitor.editorial.entities.Entity_SubEditorPagesAssignments;
import com.monitor.editorial.entities.Entity_SubEditorStoryVersion;
import com.monitor.editorial.entities.Entity_UserReportedStories;
import com.monitor.editorial.entities.Entity_Users;
import com.monitor.editorial.services.LocalCoreObject;

public class EditingRS extends LocalCoreObject {

	public GenericResponse EditingService(JSONObject o, String request) {

		if (request.equals("getUnEditedStoriesByCategoryAndDate"))
			return getUnEditedStoriesByCategoryAndDate(o);

		if (request.equals("getRejectedStoriesByCategoryAndDate"))
			return getRejectedStoriesByCategoryAndDate(o);

		if (request.equals("getEditedStoryByDateForChiefSub"))
			return getEditedStoryByDateForChiefSub(o);

		if (request.equals("getRejectedEditedStoryByDateForChiefSub"))
			return getRejectedEditedStoryByDateForChiefSub(o);

		if (request.equals("getEditedStoryById"))
			return getEditedStoryById(o);

		if (request.equals("getPagesAssignmentByDateForChiefSub"))
			return getPagesAssignmentByDateForChiefSub(o);

		if (request.equals("getPagesAssignmentBySubEditorIdAndDate"))
			return getPagesAssignmentBySubEditorIdAndDate(o);

		if (request.equals("changeStoryBookPageAssignment"))
			return changeStoryBookPageAssignment(o);

		if (request.equals("markStoryEditedAsSubEditorSeen"))
			return markStoryEditedAsSubEditorSeen(o);

		if (request.equals("saveEditorsComment"))
			return saveEditorsComment(o);

		if (request.equals("getAllCommentsByStoryId"))
			return getAllCommentsByStoryId(o);

		if (request.equals("withdrawStoryFromSubEditing"))
			return withdrawStoryFromSubEditing(o);

		if (request.equals("getAllBookPages"))
			return getAllBookPages(o);

		if (request.equals("getAllBookPages"))
			return getAllBookPages(o);

		if (request.equals("saveSubEditorStoryVersion"))
			return saveSubEditorStoryVersion(o);

		if (request.equals("markStoryAsSeen"))
			return markStoryAsEditorSeen(o);

		if (request.equals("markStoryAsSubEditorialRejected"))
			return markStoryAsSubEditorialRejected(o);

		if (request.equals("markStoryAsEditorialRejected"))
			return markStoryAsEditorialRejected(o);

		if (request.equals("markStoryAsEditorialApproved"))
			return markStoryAsEditorialApproved(o);

		if (request.equals("markStoryAsSubEditorialApproved"))
			return markStoryAsEditorialApproved(o);

		if (request.equals("saveEdittedBySupervisorStory"))
			return saveEdittedBySupervisorStory(o);

		return null;
	}

	private GenericResponse saveSubEditorStoryVersion(JSONObject o) {
		Entity_SubEditorStoryVersion subStoryVersion = null;
		Long storyId = o.getLong("storyId");
		String storyTitle = o.getString("storyTitle");
		String storyContent = o.getString("storyContent");
		Long editedStoryId = o.getLong("editedStoryId");
		Long originalStoryId = o.getLong("originalStoryId");
		Long subEditorUserId = o.getLong("subEditorUserId");
		Object obj = new Object();
		try {
			if (storyTitle.equals("") || storyTitle == null)
				return new GenericResponse(2, "Story Title is missing", null);

			if (storyContent.equals("") || storyContent == null)
				return new GenericResponse(2, "Story Content is missing", null);

			if (storyId != null) {
				subStoryVersion = (Entity_SubEditorStoryVersion) getEntityById(Entity_SubEditorStoryVersion.class,
						storyId).getReturnObject();

				Entity_SubEditorStoryVersion subEVersion = null;
				if (subStoryVersion != null)
					subEVersion = (Entity_SubEditorStoryVersion) getOneEntityByField(Entity_SubEditorStoryVersion.class,
							"storyTitle", storyTitle);

				if (subEVersion != null)
					if (!subStoryVersion.getId().equals(subEVersion.getId()))
						return new GenericResponse(2, "Story with such a Title  already exists.", null);

				subEVersion.setDateEdited(getCurrentTimeStamp());

			} else {
				subStoryVersion = new Entity_SubEditorStoryVersion();
			}
			subStoryVersion.setStoryTitle(storyTitle);
			subStoryVersion.setStoryContent(storyContent);
			subStoryVersion.setEditedStoryId(editedStoryId);
			subStoryVersion.setSubEditorUserId(subEditorUserId);
			subStoryVersion.setOriginalStoryId(originalStoryId);
			subStoryVersion.setDateEdited(getCurrentTimeStamp());

			if (!saveEntity(subStoryVersion))
				throw new DauCentralException("Failed to saved succesfully");

			// sendEmailNotification();
			return new GenericResponse(0, "story added sucessgully", subStoryVersion);

		} catch (DauCentralException e) {
			e.printStackTrace();
			return new GenericResponse(0, "Failed to save story", null);
		}
	}

	private GenericResponse getAllBookPagesWithoutStoryOnDate(JSONObject o) {

		List<Entity_SubEditorPagesAssignments> storyPageAssignment = null;
		List<Entity_BookPages> bookPagesListToReturn = new ArrayList<Entity_BookPages>();
		String date = "";
		String d_ = "";
		date = o.getString("date");
		try {
			if (date == null) {
				date = getCurrentTimeStamp().toString();
				String[] d = date.split(" ");
				d_ = d[0];
			} else {
				d_ = date;
			}

			List<Entity_BookPages> bookPagesList = (List<Entity_BookPages>) getEntityList("From Entity_BookPages")
					.getReturnObject();

			return new GenericResponse(0, "book pages", bookPagesList);
		} catch (Exception e) {
			e.printStackTrace();
			return new GenericResponse(99, "Error occured while getting stories", null);
		}
	}

	private GenericResponse getAllBookPages(JSONObject o) {
		List<Entity_SubEditorPagesAssignments> storyPageAssignmentList = null;
		Entity_SubEditorPagesAssignments storyPageAssignment = new Entity_SubEditorPagesAssignments();
		List<Entity_BookPages> bookPagesListToReturn = new ArrayList<Entity_BookPages>();
		Entity_Users subEditor = new Entity_Users();
		String date = "";
		String d_ = "";

		try {
			date = o.getString("date");
			if (date == null) {
				date = getCurrentTimeStamp().toString();
				String[] d = date.split(" ");
				d_ = d[0];
			} else {
				d_ = date;
			}
			List<Entity_BookPages> bookPagesList = (List<Entity_BookPages>) getEntityList("From Entity_BookPages")
					.getReturnObject();

			for (Entity_BookPages page : bookPagesList) {
				storyPageAssignmentList = (List<Entity_SubEditorPagesAssignments>) getEntityList(
						"From Entity_SubEditorPagesAssignments where pageNumberId=" + page.getId()
								+ " and to_char(dateAssigned ,'YYYY-MM-DD')= '" + d_ + "'").getReturnObject();

				if (storyPageAssignmentList != null)
					storyPageAssignment = storyPageAssignmentList.size() > 0 ? storyPageAssignmentList.get(0) : null;

				if (storyPageAssignment != null) {
					subEditor = (Entity_Users) getEntityById(Entity_Users.class,
							storyPageAssignment.getSubEditorUserId()).getReturnObject();

					if (subEditor != null)
						storyPageAssignment.setSubEditor(subEditor);
				}
				page.setPageAssignment(storyPageAssignment);

				bookPagesListToReturn.add(page);
			}
			return new GenericResponse(0, "book pages", bookPagesListToReturn);
		} catch (Exception e) {
			e.printStackTrace();
			return new GenericResponse(99, "Error occured while getting stories", null);
		}
	}

	@SuppressWarnings("unchecked")
	private GenericResponse getEditedStoryByDateForChiefSub(JSONObject o) {
		ReportingRS reporter = new ReportingRS();
		Entity_EditedStories editedStory = null;
		Entity_Users editor = null;
		List<Entity_EditedStories> editedStoriesList = new ArrayList<Entity_EditedStories>();
		Long storySubEditorialApproval = o.getLong("storySubEditorialApproval");
		String date = "";
		String d_ = "";
		JSONArray dateRangeValues = o.getJSONArray("dateRangeValues");

		try {
			// cater for date range picker
			if (dateRangeValues == null)
				return new GenericResponse(99, "Supply date(s) and try again", null);
			if (dateRangeValues.size() <= 0)
				return new GenericResponse(99, "Supply date(s) and try again", null);

			List<String> d = new ArrayList<String>();
			for (Object od : dateRangeValues) {
				date = (String) od;
				d.add(date);
			}
			String query = "From Entity_EditedStories where pageNumberId=null"
					+ " and (storySubEditorialApproval= null or storySubEditorialApproval=" + 1
					+ ") and eStoryId IN (Select max(eStoryId) From Entity_EditedStories group by reportedStoryId) and ";

			if (d.get(1) == null) {
				editedStoriesList = (List<Entity_EditedStories>) getEntityList(
						query + "(to_char(dateEdited ,'YYYY-MM-DD')= '" + d.get(0)
								+ "' or to_char(dateOfSubApprovalStatus ,'YYYY-MM-DD')= '" + d.get(0)
								+ "' or to_char(dateChiefOfSubApprovalStatus ,'YYYY-MM-DD')= '" + d.get(0) + "')")
										.getReturnObject();
			} else {
				editedStoriesList = (List<Entity_EditedStories>) getEntityList(
						query + "(to_char(dateEdited ,'YYYY-MM-DD') between  '" + d.get(0) + "' and '" + d.get(1)
								+ "' or to_char(dateOfSubApprovalStatus ,'YYYY-MM-DD')between '" + d.get(0) + "' and '"
								+ d.get(1) + "' or to_char(dateChiefOfSubApprovalStatus ,'YYYY-MM-DD')between '"
								+ d.get(0) + "' and '" + d.get(1) + "')").getReturnObject();
			}

			if (editedStoriesList == null)
				return new GenericResponse(99, "No stories found", null);

			if (editedStoriesList.size() > 0) {
				for (Entity_EditedStories es : editedStoriesList) {
					if (es.getReportedStoryId() != null)
						es.setOriginalStory(getReportedStoryById(es.getReportedStoryId()));
					if (es.getEditedBy() != null) {
						editor = (Entity_Users) getEntityById(Entity_Users.class, es.getEditedBy()).getReturnObject();
						if (editor != null)
							es.setStoryEditor(editor);
					}
				}
				return new GenericResponse(0, "stories", editedStoriesList);
			} else {
				return new GenericResponse(0, "no stories found for " + d.get(0), null);
			}
		} catch (Exception e) {
			e.printStackTrace();
			return new GenericResponse(99, "Error occured while getting stories", null);
		}
	}

	// get rejected stories for chief sub editor
	private GenericResponse getRejectedEditedStoryByDateForChiefSub(JSONObject o) {
		List<Entity_EditedStories> editedStoriesList = new ArrayList<Entity_EditedStories>();
		String date = "";
		JSONArray dateRangeValues = o.getJSONArray("dateRangeValues");
		try {
			// cater for date range picker
			if (dateRangeValues == null)
				return new GenericResponse(99, "Supply date(s) and try again", null);
			if (dateRangeValues.size() <= 0)
				return new GenericResponse(99, "Supply date(s) and try again", null);

			List<String> d = new ArrayList<String>();
			for (Object od : dateRangeValues) {
				date = (String) od;
				d.add(date);
			}
			if (d.get(1) == null) {
				editedStoriesList = (List<Entity_EditedStories>) getEntityList("From Entity_EditedStories where "
						+ "((to_char(dateEdited ,'YYYY-MM-DD')= '" + d.get(0)
						+ "') or (to_char(dateOfSubApprovalStatus ,'YYYY-MM-DD')= '" + d.get(0)
						+ "') or (to_char(dateChiefOfSubApprovalStatus ,'YYYY-MM-DD')= '" + d.get(0)
						+ "')) and storySubEditorialApproval=-1"
						+ " and eStoryId IN (Select max(eStoryId) From Entity_EditedStories group by reportedStoryId) order by eStoryId desc")
								.getReturnObject();
			} else {
				editedStoriesList = (List<Entity_EditedStories>) getEntityList("From Entity_EditedStories where "
						+ "((to_char(dateEdited ,'YYYY-MM-DD') between  '" + d.get(0) + "' and '" + d.get(1)
						+ "') or (to_char(dateOfSubApprovalStatus ,'YYYY-MM-DD') between '" + d.get(0) + "' and '"
						+ d.get(1) + "') or (to_char(dateChiefOfSubApprovalStatus ,'YYYY-MM-DD') between  '" + d.get(0)
						+ "' and '" + d.get(1) + "')) and storySubEditorialApproval=-1"
						+ " and eStoryId IN (Select max(eStoryId) From Entity_EditedStories group by reportedStoryId) order by eStoryId desc")
								.getReturnObject();
			}
			if (editedStoriesList == null)
				return new GenericResponse(99, "No stories found", null);

			if (editedStoriesList.size() > 0) {
				for (Entity_EditedStories es : editedStoriesList) {
					if (es.getReportedStoryId() != null)
						es.setOriginalStory(getReportedStoryById(es.getReportedStoryId()));
				}
				return new GenericResponse(0, "stories", editedStoriesList);
			} else {
				return new GenericResponse(0, "no stories found for " + d.get(1), null);
			}
		} catch (Exception e) {
			e.printStackTrace();
			return new GenericResponse(99, "Error occured while getting stories", null);
		}
	}

	private GenericResponse markStoryEditedAsSubEditorSeen(JSONObject o) {
		Entity_EditedStories editedStory = null;

		Long eStoryId = o.getLong("eStoryId");
		try {
			if (eStoryId == null)
				throw new DauCentralException("Error occured in marking story as seen");
			editedStory = (Entity_EditedStories) getEntityById(Entity_EditedStories.class, eStoryId).getReturnObject();

			if (editedStory == null)
				throw new DauCentralException("Error occured in marking story as seen");

			editedStory.setSubEditorSeen(true);
			if (!saveEntity(editedStory))
				throw new DauCentralException("Failed to mark story has seen");

			return new GenericResponse(0, "", editedStory);
		} catch (DauCentralException e) {
			e.printStackTrace();
			return new GenericResponse(0, "", null);
		}
	}

	private GenericResponse markStoryAsSubEditorialRejected(JSONObject o) {
		Entity_EditedStories editedStory = null;
		Entity_ReportedStories reportedStory = null;
		Long eStoryId = o.getLong("eStoryId");
		Long reportedStoryId = o.getLong("reportedStoryId");
		Long storySubEditorialApproval = o.getLong("storySubEditorialApproval");
		try {
			if (reportedStoryId == null)
				return new GenericResponse(99, "Details missing to complete this action", null);
			if (eStoryId == null)
				return new GenericResponse(99, "Details missing to complete this action", null);

			editedStory = (Entity_EditedStories) getEntityById(Entity_EditedStories.class, eStoryId).getReturnObject();

			reportedStory = (Entity_ReportedStories) getEntityById(Entity_ReportedStories.class, reportedStoryId)
					.getReturnObject();
			if ((editedStory != null) && (reportedStory != null)) {
				if (storySubEditorialApproval == null)
					return new GenericResponse(99, "Technicle occured while processing action. Contact admin for help",
							null);

				editedStory.setStorySubEditorialApproval(storySubEditorialApproval);
				editedStory.setSubEditorApproval(storySubEditorialApproval);
				editedStory.setDateOfSubApprovalStatus(getCurrentTimeStamp());
				editedStory.setDateChiefOfSubApprovalStatus(getCurrentTimeStamp());
				// editedStory.setPageNumberId(null);
				if (!saveEntity(editedStory))
					return new GenericResponse(99, "Failed to mark story as approved/rejected", null);

				reportedStory.setStorySubEditorialApproval(o.getLong("storySubEditorialApproval"));
				if (!saveEntity(reportedStory))
					return new GenericResponse(99, "Failed to mark story as approved/rejected", null);
			}
			return new GenericResponse(0, "Story rejected action completed", editedStory);
		} catch (Exception e) {
			e.printStackTrace();
			return new GenericResponse(99, "Errors occured while processing action", null);
		}
	}

	// for cief sub
	private GenericResponse getPagesAssignmentByDateForChiefSub(JSONObject o) {
		Entity_BookPages bookPage = null;
		List<Entity_BookPages> bookPagesList = new ArrayList<Entity_BookPages>();
		List<Entity_EditedStories> listOfStoriesToSubEdit = new ArrayList<Entity_EditedStories>();
		List<Entity_SubEditorPagesAssignments> pageAssignmentList = new ArrayList<Entity_SubEditorPagesAssignments>();
		List<Entity_EditedStories> editedStoriesListToReturn = new ArrayList<Entity_EditedStories>();
		Long subEditorUserId = o.getLong("subEditorUserId");
		String date = "";
		String d_ = "";
		date = o.getString("date");
		try {
			if (date == null) {
				date = getCurrentTimeStamp().toString();
				String[] d = date.split(" ");
				d_ = d[0];
			} else {
				d_ = date;
			}
			if (subEditorUserId == null)
				pageAssignmentList = (List<Entity_SubEditorPagesAssignments>) getEntityList(
						"From Entity_SubEditorPagesAssignments where  to_char(dateAssigned ,'YYYY-MM-DD')='" + d_ + "'")
								.getReturnObject();

			if (subEditorUserId != null)
				pageAssignmentList = (List<Entity_SubEditorPagesAssignments>) getEntityList(
						"From Entity_SubEditorPagesAssignments where  to_char(dateAssigned ,'YYYY-MM-DD')='" + d_
								+ "' and subEditorUserId =" + subEditorUserId + "").getReturnObject();

			if (pageAssignmentList.size() > 0) {
				// get edited stories by by id
				for (Entity_SubEditorPagesAssignments pAssignment : pageAssignmentList) {
					bookPage = (Entity_BookPages) getEntityById(Entity_BookPages.class, pAssignment.getPageNumberId())
							.getReturnObject();
					if (bookPage != null)
						/*
						 * listOfStoriesToSubEdit = getEdittedStoriesByPageNumberIdAndAssignemtDate(
						 * pAssignment.getPageNumberId(), d_);
						 */

						if (pAssignment.getPageNumberId() == null)
							throw new DauCentralException("Can't find un identified story");
					listOfStoriesToSubEdit = (List<Entity_EditedStories>) getEntityList(
							"From Entity_EditedStories where pageNumberId=" + pAssignment.getPageNumberId()
									+ " and to_char(chiefSubToSubAssignmentDate ,'YYYY-MM-DD')= '" + d_
									+ "' and storySubEditorialApproval=1").getReturnObject();

					if (listOfStoriesToSubEdit != null)
						if (listOfStoriesToSubEdit.size() > 0) {
							for (Entity_EditedStories editedStory : listOfStoriesToSubEdit) {
								Set<Entity_UserReportedStories> set = new HashSet<Entity_UserReportedStories>(
										getStoryOwners(editedStory.getReportedStoryId()));

								Set<Entity_ReportedStoryFiles> storyFiles = new HashSet<Entity_ReportedStoryFiles>(
										getStoryFiles(editedStory.getReportedStoryId()));

								List<Entity_SubEditorStoryVersion> subEditorStoryVersionsList = getSubEditorStoryVersionsList(
										editedStory.geteStoryId());

								editedStory.setStoryReporters(set);
								editedStory.setStoryFiles(storyFiles);
								editedStory.setSubEditorStoryVersionsList(subEditorStoryVersionsList);
								editedStoriesListToReturn.add(editedStory);
							}
							bookPage.setListOfStoriesToSubEdit(listOfStoriesToSubEdit);
							Entity_Users subEditor = (Entity_Users) getEntityById(Entity_Users.class,
									pAssignment.getSubEditorUserId()).getReturnObject();
							bookPage.setSubEditor(subEditor);
							bookPagesList.add(bookPage);
						} else {
							deleteEntity(pAssignment);
						}
				}
			}
			return new GenericResponse(0, "pages assignment", bookPagesList);
		} catch (Exception e) {
			e.printStackTrace();
			return new GenericResponse(99, "Error occured while getting pages to sub-editor", null);
		}
	}

	private List<Entity_EditedStories> getEdittedStoriesByPageNumberIdAndAssignemtDate(Long pageNumberId,
			String chiefSubAssignmentDate) {
		List<Entity_EditedStories> editedStoriesListToReturn = new ArrayList<Entity_EditedStories>();
		List<Entity_EditedStories> editedStoriesList = new ArrayList<Entity_EditedStories>();
		try {
			if (pageNumberId == null)
				throw new DauCentralException("Can't find un identified story");
			editedStoriesList = (List<Entity_EditedStories>) getEntityList(
					"From Entity_EditedStories where pageNumberId=" + pageNumberId
							+ " and to_char(chiefSubToSubAssignmentDate ,'YYYY-MM-DD')= '" + chiefSubAssignmentDate
							+ "' and storySubEditorialApproval=1").getReturnObject();

			if (editedStoriesList == null)
				return null;
			if (editedStoriesList.size() <= 0)
				return null;
			for (Entity_EditedStories editedStory : editedStoriesList) {
				Set<Entity_UserReportedStories> set = new HashSet<Entity_UserReportedStories>(
						getStoryOwners(editedStory.getReportedStoryId()));

				Set<Entity_ReportedStoryFiles> storyFiles = new HashSet<Entity_ReportedStoryFiles>(
						getStoryFiles(editedStory.getReportedStoryId()));

				List<Entity_SubEditorStoryVersion> subEditorStoryVersionsList = getSubEditorStoryVersionsList(
						editedStory.geteStoryId());

				editedStory.setStoryReporters(set);
				editedStory.setStoryFiles(storyFiles);
				editedStory.setSubEditorStoryVersionsList(subEditorStoryVersionsList);
				editedStoriesListToReturn.add(editedStory);

			}
			return editedStoriesListToReturn;
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}
	}

//===========get edited story by id for sub-editorial===============
	private GenericResponse getEditedStoryById(JSONObject o) {
		ReportingRS reporter = new ReportingRS();
		List<Entity_EditedStories> editedStoriesList = new ArrayList<Entity_EditedStories>();
		Entity_EditedStories editedStory = null;

		Long eStoryId = o.getLong("eStoryId");
		try {

			if (eStoryId == null)
				return new GenericResponse(99, "System can't find unidentified story! contact adimn for help", null);

			editedStory = (Entity_EditedStories) getEntityById(Entity_EditedStories.class, eStoryId).getReturnObject();

			if (editedStory == null)
				return new GenericResponse(99, "Identified story doesn't exist! contact adimn for help", null);

			if (editedStory.getReportedStoryId() != null) {
				editedStory.setOriginalStory(getReportedStoryById(editedStory.getReportedStoryId()));
				editedStoriesList.add(editedStory);
			}
			return new GenericResponse(0, "You have  retrived this story. Assign to a page for subediting ",
					editedStoriesList);

		} catch (Exception e) {
			e.printStackTrace();
			return new GenericResponse(99, "Error occured while getting stories", null);
		}
	}

	// step 1
	private GenericResponse getPagesAssignmentBySubEditorIdAndDate(JSONObject o) {
		Entity_BookPages bookPage = null;
		Entity_Users subEditor = null;
		List<Entity_EditedStories> listOfStoriesToSubEdit = new ArrayList<Entity_EditedStories>();
		List<Entity_BookPages> bookPagesList = new ArrayList<Entity_BookPages>();
		List<Entity_SubEditorPagesAssignments> pageAssignmentList = new ArrayList<Entity_SubEditorPagesAssignments>();
		List<Entity_EditedStories> editedStoriesListToReturn = new ArrayList<Entity_EditedStories>();
		Long subEditorUserId = o.getLong("subEditorUserId");
		String date = o.getString("date");
		String d_ = "";
		try {
			if (date == null) {
				date = getCurrentTimeStamp().toString();
				String[] d = date.split(" ");
				d_ = d[0];
			} else {
				d_ = date;
			}
			if (subEditorUserId == null)
				return new GenericResponse(99, "Can't get stories assignments for un identified  sub editor", null);
			subEditor = (Entity_Users) getEntityById(Entity_Users.class, subEditorUserId).getReturnObject();

			if (subEditor == null)
				return new GenericResponse(99, "Can't get stories assignments for un identified  sub editor", null);

			pageAssignmentList = (List<Entity_SubEditorPagesAssignments>) getEntityList(
					"From Entity_SubEditorPagesAssignments where subEditorUserId=" + subEditorUserId
							+ " and to_char(dateAssigned ,'YYYY-MM-DD')= '" + d_ + "'").getReturnObject();

			if (pageAssignmentList == null)
				return new GenericResponse(99, "Can't get stories assignments for un identified  sub editor", null);

			if (pageAssignmentList.size() > 0) {
				// get edited stories by id
				for (Entity_SubEditorPagesAssignments pAssignment : pageAssignmentList) {
					if (pAssignment.getPageNumberId() == null)
						return new GenericResponse(99, "Can't find stories for unidentified page", bookPagesList);

					bookPage = (Entity_BookPages) getEntityById(Entity_BookPages.class, pAssignment.getPageNumberId())
							.getReturnObject();

					if (bookPage == null)
						return new GenericResponse(99, "Can't find stories for unidentified page", bookPagesList);

					listOfStoriesToSubEdit = (List<Entity_EditedStories>) getEntityList(
							"From Entity_EditedStories where pageNumberId=" + bookPage.getId()
									+ " and to_char(chiefSubToSubAssignmentDate ,'YYYY-MM-DD')= '" + d_
									+ "' and storySubEditorialApproval=1 and subEditorApproval=1").getReturnObject();

					if (listOfStoriesToSubEdit != null)
						if (listOfStoriesToSubEdit.size() > 0) {
							for (Entity_EditedStories editedStory : listOfStoriesToSubEdit) {
								Set<Entity_UserReportedStories> set = new HashSet<Entity_UserReportedStories>(
										getStoryOwners(editedStory.getReportedStoryId()));

								Set<Entity_ReportedStoryFiles> storyFiles = new HashSet<Entity_ReportedStoryFiles>(
										getStoryFiles(editedStory.getReportedStoryId()));

								List<Entity_SubEditorStoryVersion> subEditorStoryVersionsList = getSubEditorStoryVersionsList(
										editedStory.geteStoryId());

								editedStory.setStoryReporters(set);
								editedStory.setStoryFiles(storyFiles);
								editedStory.setSubEditorStoryVersionsList(subEditorStoryVersionsList);
								editedStoriesListToReturn.add(editedStory);
							}
							bookPage.setListOfStoriesToSubEdit(listOfStoriesToSubEdit);
							bookPage.setSubEditor(subEditor);
							bookPage.setPageAssignment(pAssignment);
							bookPagesList.add(bookPage);
						} else {
							deleteEntity(pAssignment);
						}

					/*
					 * if (listOfStoriesToSubEdit != null) { if (listOfStoriesToSubEdit.size() <= 0)
					 * deleteEntity(pAssignment); } else { deleteEntity(pAssignment); }
					 * bookPage.setListOfStoriesToSubEdit(listOfStoriesToSubEdit);
					 * bookPagesList.add(bookPage);
					 */
				}
			}
			return new GenericResponse(0, "page to sub editor assignment", bookPagesList);
		} catch (Exception e) {
			e.printStackTrace();
			return new GenericResponse(99, "Error occured while pages to sub-editor", null);
		}
	}

	// step 2
	private Entity_EditedStories getEdittedStoriesById(Long storyId) {
		Entity_EditedStories editedStory = null;
		try {
			if (storyId == null)
				throw new DauCentralException("Can't find un identified story");
			editedStory = (Entity_EditedStories) getEntityById(Entity_EditedStories.class, storyId).getReturnObject();
			if (editedStory == null)
				throw new DauCentralException("No story found");

			Set<Entity_UserReportedStories> set = new HashSet<Entity_UserReportedStories>(
					getStoryOwners(editedStory.getReportedStoryId()));

			Set<Entity_ReportedStoryFiles> storyFiles = new HashSet<Entity_ReportedStoryFiles>(
					getStoryFiles(editedStory.getReportedStoryId()));

			/*
			 * Set<Entity_SubEditorStoryVersion> subEditorStoryVersionsList = new
			 * HashSet<Entity_SubEditorStoryVersion>(
			 * getSubEditorStoryVersionsList(editedStory.geteStoryId()));
			 */
			List<Entity_SubEditorStoryVersion> subEditorStoryVersionsList = getSubEditorStoryVersionsList(
					editedStory.geteStoryId());
			editedStory.setStoryReporters(set);
			editedStory.setStoryFiles(storyFiles);
			editedStory.setSubEditorStoryVersionsList(subEditorStoryVersionsList);
			return editedStory;
		} catch (DauCentralException e) {
			e.printStackTrace();
			return null;
		}
	}

	private List<Entity_SubEditorStoryVersion> getSubEditorStoryVersionsList(Long eStoryId) {
		List<Entity_SubEditorStoryVersion> subStoriesVersionList = new ArrayList<Entity_SubEditorStoryVersion>();
		try {
			if (eStoryId == null)
				throw new DauCentralException("Can't find un identified story");
			subStoriesVersionList = (List<Entity_SubEditorStoryVersion>) getManyEntitiesByFieldWithOrder(
					Entity_SubEditorStoryVersion.class, "editedStoryId", eStoryId, "id");

			return subStoriesVersionList;
		} catch (DauCentralException e) {
			e.printStackTrace();
			return null;
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

			List<Entity_StoryComments> comments = (List<Entity_StoryComments>) getEntityList(
					"select c From Entity_StoryComments c where reportedStoryId=" + storyId + " order by c.date DESC")
							.getReturnObject();
			reportedStory.setComments(comments);

			reportedStory.setStoryCategoryEntity(getStoryCategoryById(reportedStory.getStoryCategoryId()));
			reportedStory.setStoryReporters(set);

			reportedStory.setStoryFiles(storyFiles);
			return reportedStory;
		} catch (DauCentralException e) {
			e.printStackTrace();
			return null;
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

	private Entity_StoryCategory getStoryCategoryById(Long catId) {
		Entity_StoryCategory storyCat = new Entity_StoryCategory();
		try {
			if (catId == null)
				throw new DauCentralException("can't get story category un identified");
			storyCat = (Entity_StoryCategory) getEntityById(Entity_StoryCategory.class, catId).getReturnObject();
			return storyCat;
		} catch (DauCentralException e) {
			e.printStackTrace();
			return null;
		}
	}

	private GenericResponse assignStoriesToBookPages(JSONObject o) {
		Entity_EditedStories editedStory = null;
		Entity_BookPages pageNumber = null;
		Entity_Users chiefSubEditor = null;
		List<Entity_EditedStories> editedStoriesList = new ArrayList<Entity_EditedStories>();
		JSONArray storiesArray = o.getJSONArray("storiesArray");
		Long subEditorUserId = o.getLong("subEditorUserId");
		Long cSubEditorUserId = o.getLong("cSubEditorUserId");
		Long pageNumberId = o.getLong("pageNumberId");
		try {
			if (storiesArray.size() <= 0)
				throw new DauCentralException("No stories selected to assign");

			if (pageNumberId == null)
				throw new DauCentralException("Can't alocate stories to undefined page number");

			if (cSubEditorUserId == null)
				throw new DauCentralException("Can't enable assigning story by un identified chief sub editor");
			pageNumber = (Entity_BookPages) getEntityById(Entity_BookPages.class, pageNumberId).getReturnObject();

			if (pageNumber == null)
				throw new DauCentralException("Can't alocate stories to undefined page number");

			for (Object ob : storiesArray) {
				JSONObject os = (JSONObject) ob;
				Long eStoryId = os.getLong("eStoryId");
				if (eStoryId != null)
					editedStory = (Entity_EditedStories) getEntityById(Entity_EditedStories.class, eStoryId)
							.getReturnObject();
				if (editedStory != null) {
					editedStory.setPageNumberId(pageNumberId);
					editedStory.setChiefSubToSubAssignmentDate(getCurrentTimeStamp());
					if (saveEntity(editedStory)) {
						JSONObject jsonString = new JSONObject();
						jsonString.put("subEditorUserId", subEditorUserId);
						jsonString.put("cSubEditorUserId", cSubEditorUserId);
						jsonString.put("pageNumberId", pageNumberId);
						// assignPagesToSubEditor(jsonString);
						editedStoriesList.add(editedStory);
					}
				}
			}
			return new GenericResponse(0, "story-page assignment completed sucessfully", editedStoriesList);
		} catch (DauCentralException e) {
			e.printStackTrace();
			return null;
		}
	}

	private GenericResponse changeStoryBookPageAssignment(JSONObject o) {
		Entity_EditedStories editedStory = null;
		Entity_BookPages pageNumber = null;
		Entity_Users chiefSubEditor = null;
		List<Entity_EditedStories> editedStoriesList = new ArrayList<Entity_EditedStories>();
		Entity_SubEditorPagesAssignments pageAssignment = new Entity_SubEditorPagesAssignments();
		List<Entity_SubEditorPagesAssignments> pageAssignmentList = new ArrayList<Entity_SubEditorPagesAssignments>();
		Long pageNumberId = o.getLong("pageNumberId");
		Long eStoryId = o.getLong("eStoryId");
		String date = "";
		String d_ = "";
		date = o.getString("date");

		try {
			if (date == null) {
				date = getCurrentTimeStamp().toString();
				String[] d = date.split(" ");
				d_ = d[0];
			} else {
				d_ = date;
			}
			if (pageNumberId == null)
				return new GenericResponse(99, "Can't alocate stories to undefined page number", null);
			pageNumber = (Entity_BookPages) getEntityById(Entity_BookPages.class, pageNumberId).getReturnObject();

			if (pageNumber == null)
				return new GenericResponse(99, "Can't alocate stories to undefined page number", null);

			pageAssignmentList = (List<Entity_SubEditorPagesAssignments>) getEntityList(
					"From Entity_SubEditorPagesAssignments where pageNumberId=" + pageNumberId
							+ " and to_char(dateAssigned ,'YYYY-MM-DD')= '" + d_ + "'").getReturnObject();
			pageAssignment = pageAssignmentList.size() > 0 ? pageAssignmentList.get(0) : null;
			if (pageAssignment == null)
				return new GenericResponse(2, "you can't change story assignment to unexisting page on " + d_, null);

			if (eStoryId == null)
				return new GenericResponse(99,
						"Can't shift un identified story to another page. Contact admin for help", null);

			editedStory = (Entity_EditedStories) getEntityById(Entity_EditedStories.class, eStoryId).getReturnObject();
			if (editedStory == null)
				return new GenericResponse(99,
						"Can't shift un identified story to another page. Contact admin for help", null);

			editedStory.setPageNumberId(pageNumberId);

			if (saveEntity(editedStory))
				return new GenericResponse(0, "story-page assignment completed sucessfully", editedStoriesList);

			return new GenericResponse(99, "story-page changing failed", null);

		} catch (Exception e) {
			e.printStackTrace();
			return new GenericResponse(99, "Errors occured during story-page changing", null);
		}
	}

	private List<Entity_EditedStories> markStoriesAsSentForSubEditing(List<Entity_EditedStories> editedStoriesList) {

		List<Entity_EditedStories> _editedStoriesList = new ArrayList<Entity_EditedStories>();

		try {
			if (editedStoriesList.size() > 0)
				for (Entity_EditedStories story : editedStoriesList) {
					if (saveEntity(story))
						_editedStoriesList.add(story);
				}
			return _editedStoriesList;

		} catch (Exception e) {
			e.printStackTrace();
			return null;
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

	private GenericResponse withdrawStoryFromSubEditing(JSONObject o) {
		Long eStoryId = o.getLong("eStoryId");
		Entity_SubEditorPagesAssignments sb = null;
		Entity_EditedStories editedStory = null;
		try {
			if (eStoryId == null)
				throw new DauCentralException(
						"Cant withdraw unidentified edited story from Sub Editor, contact admin for help");

			sb = (Entity_SubEditorPagesAssignments) getOneEntityByField(Entity_SubEditorPagesAssignments.class,
					"eStoryId", eStoryId);

			if (sb == null)
				throw new DauCentralException("Identified assignment not found");
			if (deleteEntity(sb)) {
				editedStory = (Entity_EditedStories) getEntityById(Entity_EditedStories.class, sb.geteStoryId())
						.getReturnObject();

				if (editedStory != null) {
					editedStory.setPageNumberId(null);
					saveEntity(editedStory);
				}

				return new GenericResponse(0, "story assignment withdrawn successfully", null);

			} else {
				return new GenericResponse(0, "no stories found for ", null);
			}
		} catch (DauCentralException e) {
			e.printStackTrace();
			return new GenericResponse(99, "Error occured while getting stories", null);
		}
	}

	// reject story by editor and save comment
	private GenericResponse saveEditorsComment(JSONObject o) {
		JSONObject story = o.getJSONObject("story");
		Long storyId = story.getLong("storyId");
		JSONObject user = o.getJSONObject("user");
		Long userId = user.getLong("userId");
		String lastName = user.getString("lastName");
		String firstName = user.getString("firstName");

		try {
			if (storyId == null && userId == null)
				return new GenericResponse(99, "Can't comment on un identified story", null);

			if (o.getString("comment") == null || o.getString("comment") == "")
				return new GenericResponse(99, "Can't reject story without a comment", null);

			Entity_StoryComments c = new Entity_StoryComments();
			c.setDate(getCurrentTimeStamp());
			c.setComment(o.getString("comment"));
			c.setReportedStoryId(storyId);
			c.setUserId(userId);
			c.setStoryOwer(o.getBoolean("storyOwner"));
			c.setUsername(user.getString("username"));

			if (!saveEntity(c))
				return new GenericResponse(99, "Failed to add comment", null);

			return new GenericResponse(0, "comment added sucessgully", c);
		} catch (Exception e) {
			e.printStackTrace();
			return new GenericResponse(99, "Failed to add comment", null);
		}
	}

	// reject story by editors
	private GenericResponse markStoryAsEditorialRejected(JSONObject o) {
		Entity_EditedStories editedStory = null;
		Entity_ReportedStories reportedStory = null;
		JSONObject story = o.getJSONObject("story");
		String storyContent = story.getString("storyContent");
		Long storyId = story.getLong("storyId");
		JSONArray obAdressesArray = o.getJSONArray("storyReporterEmailAddresses");
		JSONObject user = o.getJSONObject("user");
		Long userId = user.getLong("userId");
		String lastName = user.getString("lastName");
		String firstName = user.getString("firstName");
		String username = user.getString("username");
		try {
			if (storyId == null)
				return new GenericResponse(99, "You can not reject un identified story", null);

			reportedStory = (Entity_ReportedStories) getEntityById(Entity_ReportedStories.class, storyId)
					.getReturnObject();
			if (reportedStory != null) {
				reportedStory.setEditorialApproval(-1L);
				reportedStory.setApprovalStatus(false);
				reportedStory.setDateOfEditorialApprovalStatus(getCurrentTimeStamp());
			} else {
				return new GenericResponse(99, "Failed to mark story as rejected", null);
			}

			if (!saveEntity(reportedStory))
				return new GenericResponse(99, "Failed to mark story as rejected", null);

			if (o.getString("comment") == null || o.getString("comment") == "")
				return new GenericResponse(99, "Can't reject story without a comment", null);

			if (obAdressesArray.size() > 0)
				for (Object ob : obAdressesArray) {
					String reporterEmail = (String) ob;
					String messageBody = "TITLE \n" + story.getString("storyTitle") + " \n\n Reason(s) => "
							+ o.getString("comment") + " \n\n" + storyContent.replaceAll("\\<[^>]*>", "");
					sendEmailNotification(reporterEmail, messageBody, firstName.toUpperCase() + " "
							+ lastName.toUpperCase() + "  OF EDITRIAL HAS REJECTED YOUR STORY");
				}

			saveEditorsComment(o);

			return new GenericResponse(0, "story rejected succefully", reportedStory);
		} catch (Exception e) {
			e.printStackTrace();
			return new GenericResponse(99, "Errors occured while processing reject story", null);
		}
	}

	private GenericResponse markStoryAsEditorialApproved(JSONObject o) {
		Entity_EditedStories editedStory = null;
		Entity_ReportedStories reportedStory = null;
		JSONObject story = o.getJSONObject("story");
		Long storyId = story.getLong("storyId");
		String storyContent = story.getString("storyContent");
		JSONArray obAdressesArray = o.getJSONArray("storyReporterEmailAddresses");

		JSONObject user = o.getJSONObject("user");
		String lastName = user.getString("lastName");
		String firstName = user.getString("firstName");
		try {
			if (storyId == null)
				return new GenericResponse(99, "You can not approve un identified story", null);

			reportedStory = (Entity_ReportedStories) getEntityById(Entity_ReportedStories.class, storyId)
					.getReturnObject();
			if (reportedStory != null) {
				reportedStory.setEdited(true);
				reportedStory.setApprovalStatus(true);
				reportedStory.setEditorialApproval(1L);
				reportedStory.setDateOfEditorialApprovalStatus(getCurrentTimeStamp());
			}
			if (!saveEntity(reportedStory))
				return new GenericResponse(99, "Failed to mark story as approved", null);

			if (obAdressesArray != null) {
				if (obAdressesArray.size() > 0)
					for (Object ob : obAdressesArray) {
						String reporterEmail = (String) ob;
						String messageBody = story.getString("storyTitle").toUpperCase() + " \n\n"
								+ storyContent.replaceAll("\\<[^>]*>", "");
						sendEmailNotification(reporterEmail, messageBody, firstName.toUpperCase() + " "
								+ lastName.toUpperCase() + "  OF EDITRIAL HAS APPROVED YOUR STORY");
					}
			}

			return new GenericResponse(0, "Story recovered successfully", reportedStory);
		} catch (Exception e) {
			e.printStackTrace();
			return new GenericResponse(99, "Errors occured while processing approve story", null);
		}
	}

	private GenericResponse markEditorialStoryAsApproved(JSONObject o) {
		Entity_ReportedStories reportedStory = null;
		Long storyId = o.getLong("storyId");
		try {
			if (storyId == null)
				throw new DauCentralException("Error occured in marking story as approved");
			reportedStory = (Entity_ReportedStories) getEntityById(Entity_ReportedStories.class, storyId)
					.getReturnObject();

			if (reportedStory == null)
				throw new DauCentralException("Error occured in marking story as approved");

			reportedStory.setApprovalStatus(true);
			reportedStory.setEditorialApproval(1L);
			if (!saveEntity(reportedStory))
				return new GenericResponse(99, "failed ", false);

			return new GenericResponse(0, "seen", true);
		} catch (DauCentralException e) {
			e.printStackTrace();
			return new GenericResponse(99, "Error occured in marking story as approved" + e, null);
		}
	}

	// get un edited stories by the editor
	@SuppressWarnings("unchecked")
	private GenericResponse getUnEditedStoriesByCategoryAndDate(JSONObject o) {
		List<Entity_ReportedStories> reportedStoriesList = new ArrayList<Entity_ReportedStories>();
		List<Entity_ReportedStories> reportedStoriesListToReturn = new ArrayList<Entity_ReportedStories>();
		Long storyCategoryId = o.getLong("storyCategoryId");

		String date = "";
		date = o.getString("date");
		JSONArray dateRangeValues = o.getJSONArray("dateRangeValues");

		try {
			if (dateRangeValues == null)
				return new GenericResponse(99, "Supply date(s) and try again", null);
			if (dateRangeValues.size() <= 0)
				return new GenericResponse(99, "Supply date(s) and try again", null);

			List<String> d = new ArrayList<String>();
			for (Object od : dateRangeValues) {
				date = (String) od;
				d.add(date);
			}
			if (storyCategoryId == null)
				throw new DauCentralException("Stories category not specified");

			String query = "From Entity_ReportedStories where storyCategoryId=" + storyCategoryId
					+ " and editorialApproval=0 and approvalStatus=false and ";

			if (d.get(1) == null) {
				reportedStoriesList = (List<Entity_ReportedStories>) getEntityList(
						query + " (to_char(dateSubmitted,'YYYY-MM-DD')='" + d.get(0)
								+ "' or to_char(dateEditorSeen,'YYYY-MM-DD')= '" + d.get(0) + "')").getReturnObject();
			} else {
				reportedStoriesList = (List<Entity_ReportedStories>) getEntityList(
						query + "(to_char(dateSubmitted,'YYYY-MM-DD') between  '" + d.get(0) + "' and '" + d.get(1)
								+ "' or to_char(dateEditorSeen,'YYYY-MM-DD') between  '" + d.get(0) + "' and '"
								+ d.get(1) + "')").getReturnObject();
			}

			if (reportedStoriesList != null)
				if (reportedStoriesList.size() > 0) {
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
					return new GenericResponse(0, "Edited stories for your category", reportedStoriesListToReturn);
				}
			return new GenericResponse(0, "No unedited stories for your category", reportedStoriesListToReturn);

		} catch (

		DauCentralException e) {
			e.printStackTrace();
			return new GenericResponse(99, "Errors occured while fetching Edited stories for your category", null);
		}
	}

	// get rejected stories by editor
	private GenericResponse getRejectedStoriesByCategoryAndDate(JSONObject o) {
		List<Entity_ReportedStories> reportedStoriesList = new ArrayList<Entity_ReportedStories>();
		List<Entity_ReportedStories> reportedStoriesListToReturn = new ArrayList<Entity_ReportedStories>();
		Long storyCategoryId = o.getLong("storyCategoryId");
		String date = "";
		date = o.getString("date");
		JSONArray dateRangeValues = o.getJSONArray("dateRangeValues");

		try {
			if (dateRangeValues == null)
				return new GenericResponse(99, "Supply date(s) and try again", null);
			if (dateRangeValues.size() <= 0)
				return new GenericResponse(99, "Supply date(s) and try again", null);

			List<String> d = new ArrayList<String>();
			for (Object od : dateRangeValues) {
				date = (String) od;
				d.add(date);
			}
			if (storyCategoryId == null)
				throw new DauCentralException("Stories category not specified");

			String query = "From Entity_ReportedStories where (storyCategoryId=" + storyCategoryId
					+ " and editorialApproval=-1 ) and ";
			if (d.get(1) == null) {
				reportedStoriesList = (List<Entity_ReportedStories>) getEntityList(
						query + "(to_char(dateSubmitted,'YYYY-MM-DD')= '" + d.get(0)
								+ "' or to_char(dateOfEditorialApprovalStatus ,'YYYY-MM-DD')= '" + d.get(0) + "')")
										.getReturnObject();
			} else {
				reportedStoriesList = (List<Entity_ReportedStories>) getEntityList(
						query + "(to_char(dateSubmitted ,'YYYY-MM-DD') between  '" + d.get(0) + "' and '" + d.get(1)
								+ "' or to_char(dateOfEditorialApprovalStatus ,'YYYY-MM-DD') between '" + d.get(0)
								+ "' and '" + d.get(1) + "')").getReturnObject();
			}

			if (reportedStoriesList != null)
				if (reportedStoriesList.size() > 0) {
					for (Entity_ReportedStories rs : reportedStoriesList) {
						Set<Entity_UserReportedStories> set = new HashSet<Entity_UserReportedStories>(
								getStoryOwners(rs.getStoryId()));

						Set<Entity_ReportedStoryFiles> storyFiles = new HashSet<Entity_ReportedStoryFiles>(
								getStoryFiles(rs.getStoryId()));

						List<Entity_StoryComments> comments = (List<Entity_StoryComments>) getEntityList(
								"select c From Entity_StoryComments c where reportedStoryId=" + rs.getStoryId()
										+ " order by c.date DESC").getReturnObject();

						rs.setStoryCategoryEntity(getStoryCategoryById(rs.getStoryCategoryId()));
						rs.setStoryReporters(set);
						rs.setStoryFiles(storyFiles);
						rs.setComments(comments);
						reportedStoriesListToReturn.add(rs);
					}
					return new GenericResponse(0, "Edited stories for your category", reportedStoriesListToReturn);
				}
			return new GenericResponse(0, "No unedited stories for your category", reportedStoriesListToReturn);

		} catch (

		DauCentralException e) {
			e.printStackTrace();
			return new GenericResponse(99, "Errors occured while fetching Edited stories for your category", null);
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

			if (rs != null) {
				cList = (List<Entity_StoryComments>) getEntityList(
						"select c From Entity_StoryComments c where reportedStoryId=" + storyId
								+ " order by c.date DESC").getReturnObject();

				Set<Entity_UserReportedStories> set = new HashSet<Entity_UserReportedStories>(
						getStoryOwners(rs.getStoryId()));

				rs.setStoryReporters(set);

				// Set<Entity_StoryComments> comments = new
				// HashSet<Entity_StoryComments>(cList);
				rs.setComments(cList);
				return new GenericResponse(0, "Story comments", rs);
			}

			return new GenericResponse(0, "no comments found", null);
		} catch (Exception e) {
			e.printStackTrace();
			return new GenericResponse(99, "Errors occured while getting story comment", null);
		}
	}

//save editor edited story
	private GenericResponse saveEdittedBySupervisorStory(JSONObject o) {
		Entity_EditedStories editedStory = null;
		Entity_ReportedStories reportedStory = null;
		List<Entity_EditedStories> editedStoriesList = new ArrayList<Entity_EditedStories>();

		JSONObject story = o.getJSONObject("edittedStory");
		Long storyId = story.getLong("storyId");
		Long eStoryId = story.getLong("eStoryId");
		int numberOfEditVersions = 0;
		JSONObject editor = o.getJSONObject("editor");
		Long editorId = editor.getLong("userId");
		String editorUserName = editor.getString("username");
		String firstName = editor.getString("firstName");
		String lastName = editor.getString("lastName");
		JSONArray reportersEmails = o.getJSONArray("reportersEmails");

		try {
			if (storyId == null)
				throw new DauCentralException("Can't edit un identfied story, contact admin for help");
			editedStoriesList = getManyEntitiesByField(Entity_EditedStories.class, "reportedStoryId", storyId);

			if (editedStoriesList.size() > 10) {
				editedStory = editedStoriesList.size() > 0 ? editedStoriesList.get(editedStoriesList.size() - 1) : null;
			}
			if (editedStory == null) {
				editedStory = new Entity_EditedStories();
			}
			editedStory.setReportedStoryId(storyId);
			editedStory.setStoryCategoryId(story.getLong("storyCategoryId"));
			editedStory.setStoryCategory(story.getString("storyCategory"));
			editedStory.setStoryName(story.getString("storyTitle"));
			editedStory.setStoryContent(story.getString("storyContent"));
			editedStory.setDateEdited(getCurrentTimeStamp());
			editedStory.setChiefEditorSeen(false);
			editedStory.setSubEditorSeen(false);
			editedStory.setSubEdited(false);
			editedStory.setEditedBy(editorId);
			// reportedStory.setStorySource(o.getString("storySource"));

			if (!saveEntity(editedStory))
				throw new DauCentralException("Failed to save story, Try again or contact admin for help");

			reportedStory = (Entity_ReportedStories) getEntityById(Entity_ReportedStories.class, storyId)
					.getReturnObject();
			if (reportedStory != null) {
				reportedStory.setLastEditedDate(getCurrentTimeStamp());
				reportedStory.setDateOfEditorialApprovalStatus(getCurrentTimeStamp());
				reportedStory.setApprovalStatus(true);
				reportedStory.setEditorialApproval(1L);
				reportedStory.setEditedBy(editorId);
				reportedStory.setStorySubEditorialApproval(0L);

				// send email heres to reporter

				if (reportersEmails.size() > 0)
					for (Object ob : reportersEmails) {
						String reporterEmail = (String) ob;
						String storyContent = story.getString("storyContent").replaceAll("\\<[^>]*>", "");
						String messageBody = story.getString("storyTitle").toUpperCase() + "\n\n" + storyContent;
						String fullName = firstName.toUpperCase() + " " + lastName.toUpperCase();
						try {
							sendEmailNotification(reporterEmail, messageBody, fullName + " HAS SEEN YOUR STORY");
						} catch (UnsupportedEncodingException e) {
							// TODO Auto-generated catch block
							e.printStackTrace();
						}
					}
			}

			if (!saveEntity(reportedStory))
				throw new DauCentralException("Failed to mark reported story as edited");

			editedStory.setOriginalStory(markStoryAsEdited(editedStory.getReportedStoryId()));
			editedStoriesList.clear();
			editedStoriesList.add(editedStory);

			return new GenericResponse(0, "story edited version saved sucessfully", editedStoriesList);

		} catch (DauCentralException e) {
			e.printStackTrace();
			return new GenericResponse(99, "Error occured while getting stories", null);
		}
	}

	/// ===================MARKING STORY =======================================
	// EDITED
	private Entity_ReportedStories markStoryAsEdited(Long storyId) {
		Entity_ReportedStories reportedStory = null;
		try {
			if (storyId == null)
				throw new DauCentralException("Error occured in marking story as edited");
			reportedStory = (Entity_ReportedStories) getEntityById(Entity_ReportedStories.class, storyId)
					.getReturnObject();

			if (reportedStory == null)
				throw new DauCentralException("Error occured in marking story as edited");

			reportedStory.setEdited(true);
			reportedStory.setEditorSeen(true);
			if (!saveEntity(reportedStory))
				throw new DauCentralException("Failed to mark story has edited");

			return reportedStory;
		} catch (DauCentralException e) {
			e.printStackTrace();
			return null;
		}
	}

	// AS SEEN
	private GenericResponse markStoryAsEditorSeen(JSONObject o) {
		Entity_ReportedStories reportedStory = null;
		JSONObject editor = o.getJSONObject("editor");
		Long editorId = editor.getLong("userId");
		String firstName = editor.getString("firstName");
		String lastName = editor.getString("lastName");
		JSONArray reportersEmails = o.getJSONArray("reportersEmails");
		JSONObject storySelected = o.getJSONObject("storySelected");
		Long storyId = storySelected.getLong("storyId");

		try {
			if (storyId == null)
				throw new DauCentralException("Error occured in marking story as seen");
			reportedStory = (Entity_ReportedStories) getEntityById(Entity_ReportedStories.class, storyId)
					.getReturnObject();

			if (reportedStory == null)
				throw new DauCentralException("Error occured in marking story as seen");

			if (reportersEmails == null)
				throw new DauCentralException("Error occured in marking story as seen");

			reportedStory.setEditorSeen(true);
			reportedStory.setSeenBy(editorId);
			reportedStory.setDateEditorSeen(getCurrentTimeStamp());
			if (!saveEntity(reportedStory))
				return new GenericResponse(99, "failed ", false);

			if (reportersEmails.size() > 0)
				for (Object ob : reportersEmails) {
					String reporterEmail = (String) ob;
					String storyContent = storySelected.getString("storyContent").replaceAll("\\<[^>]*>", "");
					String messageBody = storySelected.getString("storyTitle").toUpperCase() + "\n\n" + storyContent;
					String fullName = firstName.toUpperCase() + " " + lastName.toUpperCase();
					try {
						sendEmailNotification(reporterEmail, messageBody, fullName + " HAS SEEN YOUR STORY");
					} catch (UnsupportedEncodingException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}
				}
			return new GenericResponse(0, "seen", true);
		} catch (DauCentralException e) {
			e.printStackTrace();
			return new GenericResponse(99, "Error occured in marking story as seen" + e, null);
		}
	}

}

/*
 * private GenericResponse getEditedStoryByDateForSubEditor(JSONObject o) {
 * ReportingRS reporter = new ReportingRS(); Entity_EditedStories editedStory =
 * null; List<Entity_StorySubEditing> subEditedStoriesListToReturn = new
 * ArrayList<Entity_StorySubEditing>(); List<Entity_StorySubEditing>
 * subEditedStoriesList = new ArrayList<Entity_StorySubEditing>();
 * 
 * String date = ""; String d_ = "";
 * 
 * date = o.getString("date"); Long subEditorUserId =
 * o.getLong("subEditorUserId");
 * 
 * try { if (date == null) { date = getCurrentTimeStamp().toString(); String[] d
 * = date.split(" "); d_ = d[0]; } else { d_ = date; } subEditedStoriesList =
 * (List<Entity_StorySubEditing>) getEntityList(
 * "From Entity_StorySubEditing where subEditorUserId=" + subEditorUserId +
 * " and to_char(dateAssigned ,'YYYY-MM-DD')= '" + d_ + "'").getReturnObject();
 * 
 * if (subEditedStoriesList.size() > 0) { for (Entity_StorySubEditing es :
 * subEditedStoriesList) {
 * 
 * editedStory = (Entity_EditedStories)
 * getEntityById(Entity_EditedStories.class, es.geteStoryId())
 * .getReturnObject(); if (editedStory != null) {
 * editedStory.setOriginalStory(getReportedStoryById(editedStory.
 * getReportedStoryId())); }
 * 
 * es.setStory(editedStory); subEditedStoriesListToReturn.add(es); } return new
 * GenericResponse(0, "stories", subEditedStoriesListToReturn); } else { return
 * new GenericResponse(0, "no stories found for " + d_, null); }
 * 
 * } catch (Exception e) { e.printStackTrace(); return new GenericResponse(99,
 * "Error occured while getting stories", null); } }
 */

/*
 * private GenericResponse assignBookPagesToSubEditors(JSONObject o) {
 * Entity_BookPages pageNumber = null; Entity_Users subEditor = null;
 * Entity_SubEditorPagesAssignments pageAssignment = null;
 * List<Entity_SubEditorPagesAssignments> pageAssignedList = new
 * ArrayList<Entity_SubEditorPagesAssignments>();
 * List<Entity_SubEditorPagesAssignments> pageAssignmentList = new
 * ArrayList<Entity_SubEditorPagesAssignments>(); JSONArray pagesArray =
 * o.getJSONArray("pagesArray"); Long subEditorUserId =
 * o.getLong("subEditorUserId"); Long cSubEditorUserId =
 * o.getLong("cSubEditorUserId"); try { String date =
 * getCurrentTimeStamp().toString(); String[] d = date.split(" "); String d_ =
 * d[0]; if (pagesArray != null) if (pagesArray.size() <= 0) throw new
 * DauCentralException("No stories selected to assign"); if (cSubEditorUserId ==
 * null) throw new
 * DauCentralException("Can't enable assigning story by un identified chief sub editor"
 * ); subEditor = (Entity_Users) getEntityById(Entity_Users.class,
 * subEditorUserId).getReturnObject(); if (subEditor == null) throw new
 * DauCentralException("cant assign story Identified but unexsiting sub editor."
 * ); for (Object ob : pagesArray) { JSONObject pageObject = (JSONObject) ob;
 * Long pageNumberId = pageObject.getLong("pageNumberId"); pageNumber =
 * (Entity_BookPages) getEntityById(Entity_BookPages.class,
 * pageNumberId).getReturnObject(); if (pageNumber == null) throw new
 * DauCentralException("Can't alocate stories to undefined page number");
 * pageAssignmentList = (List<Entity_SubEditorPagesAssignments>) getEntityList(
 * "From Entity_SubEditorPagesAssignments where pageNumberId=" + pageNumberId +
 * " and to_char(dateAssigned ,'YYYY-MM-DD')= '" + d_ + "'").getReturnObject();
 * pageAssignment = pageAssignmentList != null ? pageAssignmentList.get(0) :
 * null; if (pageAssignment == null) { pageAssignment = new
 * Entity_SubEditorPagesAssignments();
 * pageAssignment.setPageNumberId(pageNumberId);
 * pageAssignment.setSubEditorUserId(subEditorUserId);
 * pageAssignment.setChiefSubEditorUserId(cSubEditorUserId);
 * pageAssignment.setDateAssigned(getCurrentTimeStamp()); if
 * (saveEntity(pageAssignment)) { pageAssignedList.add(pageAssignment); } } }
 * return new GenericResponse(0, "page to sub editor assigned sucessfully",
 * pageAssignedList); } catch (DauCentralException e) { e.printStackTrace();
 * return new GenericResponse(99, "Error occured while pages to sub-editor",
 * null); } }
 */

/*
 * private GenericResponse
 * getSubEditorsAssignmentForChiefSubByDateAssignment(JSONObject o) {
 * Entity_EditedStories editedStory = null; Entity_Users subEditor = null;
 * List<Entity_StorySubEditing> subEditedStoriesListToReturn = new
 * ArrayList<Entity_StorySubEditing>(); List<Entity_StorySubEditing>
 * subEditStoriesList = new ArrayList<Entity_StorySubEditing>();
 * 
 * String date = ""; String d_ = "";
 * 
 * date = o.getString("date"); Long subEditorUserId =
 * o.getLong("subEditorUserId");
 * 
 * try { if (date == null) { date = getCurrentTimeStamp().toString(); String[] d
 * = date.split(" "); d_ = d[0]; } else { d_ = date; } if (subEditorUserId ==
 * null) throw new
 * DauCentralException("Cant get assigment for un known user. contact admin for help"
 * );
 * 
 * subEditStoriesList = (List<Entity_StorySubEditing>) getEntityList(
 * "From Entity_StorySubEditing where subEditorUserId=" + subEditorUserId +
 * " and to_char(dateAssigned ,'YYYY-MM-DD')= '" + d_ + "'").getReturnObject();
 * 
 * if (subEditStoriesList == null) throw new
 * DauCentralException("has No stories assigned on " + d_);
 * 
 * if (subEditStoriesList.size() > 0) { for (Entity_StorySubEditing es :
 * subEditStoriesList) { if (es.geteStoryId() != null) editedStory =
 * (Entity_EditedStories) getEntityById(Entity_EditedStories.class,
 * es.geteStoryId()) .getReturnObject(); if (editedStory != null) { if
 * (editedStory.getReportedStoryId() != null)
 * editedStory.setOriginalStory(getReportedStoryById(editedStory.
 * getReportedStoryId())); } es.setSubEditor(subEditor);
 * es.setStory(editedStory); subEditedStoriesListToReturn.add(es); } return new
 * GenericResponse(0, "stories", subEditedStoriesListToReturn); } else { return
 * new GenericResponse(0, "no stories found for " + d_, null); }
 * 
 * } catch (DauCentralException e) { e.printStackTrace(); return new
 * GenericResponse(99, "Error occured while getting stories", null); } }
 */