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
import com.monitor.editorial.entities.Entity_Roles;
import com.monitor.editorial.entities.Entity_StoryCategory;
import com.monitor.editorial.entities.Entity_StoryComments;
import com.monitor.editorial.entities.Entity_SubEditedPages;
import com.monitor.editorial.entities.Entity_SubEditorPagesAssignments;
import com.monitor.editorial.entities.Entity_UserReportedStories;
import com.monitor.editorial.entities.Entity_Users;
import com.monitor.editorial.services.LocalCoreObject;

public class SubEditingRS extends LocalCoreObject {

	public GenericResponse subEditingService(JSONObject o, String request) {
		if (request.equals("assignStoriesPageAndPageToSubEditor"))
			return assignStoriesPageAndPageToSubEditor(o);

		if (request.equals("markStorySubEditorApprovalStatus"))
			return markStorySubEditorApprovalStatus(o);

		if (request.equals("getSubEditorStoryRejectionRequestForchiefSub"))
			return getSubEditorStoryRejectionRequestForchiefSub(o);

		if (request.equals("saveSubEditorialComments"))
			return saveSubEditorialComments(o);

		if (request.equals("subEditorSavedSubEditedPages"))
			return subEditorSavedSubEditedPages(o);

		if (request.equals("getBookPagesExistingForADay"))
			return getBookPagesExistingForADay(o);

		if (request.equals("getSubEditedpagesBySubEditorIdAndDate"))
			return getSubEditedpagesBySubEditorIdAndDate(o);

		if (request.equals("getSubEditedpagesByDateForCheifSub"))
			return getSubEditedpagesByDateForCheifSub(o);

		return null;
	}

	// sub-editor upload finished pages
	private GenericResponse subEditorSavedSubEditedPages(JSONObject o) {
		List<Entity_SubEditedPages> fileList = new ArrayList<Entity_SubEditedPages>();
		List<Entity_SubEditedPages> filesListToReturn = new ArrayList<Entity_SubEditedPages>();
		Entity_SubEditorPagesAssignments pageAssignment = new Entity_SubEditorPagesAssignments();
		List<Entity_SubEditorPagesAssignments> pageAssignmentList = new ArrayList<Entity_SubEditorPagesAssignments>();
		List<Entity_SubEditedPages> pagesList = new ArrayList<Entity_SubEditedPages>();
		Entity_SubEditedPages page = null;

		JSONObject bookPage = o.getJSONObject("bookPage");
		Long bookPageId = bookPage.getLong("id");
		String bookPageNumber = bookPage.getString("pageNumber");

		JSONObject subEditor = o.getJSONObject("subEditor");
		Long subEdtitorId = subEditor.getLong("userId");
		String username = subEditor.getString("username");
		String firstName = subEditor.getString("firstName");
		String lastName = subEditor.getString("lastName");
		JSONArray subEditedPageFiles = o.getJSONArray("pageFiles");
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
			if (subEdtitorId == null)
				return new GenericResponse(2, "you can't add sub-edited page for unidentified user", null);

			if (bookPageId == null)
				return new GenericResponse(2, "Can't add files to unknow book page assignment", null);

			pageAssignmentList = (List<Entity_SubEditorPagesAssignments>) getEntityList(
					"From Entity_SubEditorPagesAssignments where subEditorUserId=" + subEdtitorId
							+ " and to_char(dateAssigned ,'YYYY-MM-DD')= '" + d_ + "'").getReturnObject();

			pageAssignment = pageAssignmentList.size() > 0 ? pageAssignmentList.get(0) : null;

			if (pageAssignment == null)
				return new GenericResponse(2,
						"You can't add sub-edited page when you have no assigment from cheif sub-editor on " + d_,
						null);

			pagesList = (List<Entity_SubEditedPages>) getEntityList("From Entity_SubEditedPages where bookPageId="
					+ bookPageId + " and to_char(subEditedDate ,'YYYY-MM-DD')= '" + d_ + "'").getReturnObject();

			if (pagesList != null)
				page = pagesList.size() > 0 ? pagesList.get(0) : null;

			for (Object ob : subEditedPageFiles) {
				JSONObject job = new JSONObject();
				job = (JSONObject) ob;
				if (page != null)
					page = new Entity_SubEditedPages();

				page.setBookPageId(bookPageId);
				page.setFileContent(job.getString("fileContent"));
				page.setFileName(job.getString("fileName"));
				page.setSubEditedDate(getCurrentTimeStamp());
				page.setCheifSubId(pageAssignment.getChiefSubEditorUserId());
				page.setSubEdtitorId(subEdtitorId);
				page.setCheifSubApprovalStatus(false);
				page.setSubEditedDate(getCurrentTimeStamp());
				page.setPrePressReceived(false);

				if (saveEntity(page))
					filesListToReturn.add(page);

				// send email to sub-editor
				Entity_Users cheifSub = (Entity_Users) getEntityById(Entity_Users.class,
						pageAssignment.getChiefSubEditorUserId()).getReturnObject();

				sendEmailNotification(cheifSub.getUsername(), username, firstName.toUpperCase() + " "
						+ lastName.toUpperCase() + " SUB-EDITOR HAS COMPLETED " + bookPageNumber);
			}
			if (filesListToReturn.size() <= 0)
				throw new DauCentralException("Failed save all uploaded files. Contact admin for help");

			/// filesListToReturn.clear();
			return new GenericResponse(0, "sub-edited page saved successfully", filesListToReturn);

		} catch (DauCentralException e) {
			e.printStackTrace();
			return new GenericResponse(99, "Errors occured while uploading file(s)", fileList);
		} catch (UnsupportedEncodingException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			return new GenericResponse(99, "Errors occured while sending email to Cheif Sub-Editor", fileList);
		}

	}

	// sub-editor get his/her finished pages
	private GenericResponse getSubEditedpagesBySubEditorIdAndDate(JSONObject o) {

		Entity_SubEditorPagesAssignments pageAssignment = new Entity_SubEditorPagesAssignments();
		List<Entity_SubEditorPagesAssignments> pageAssignmentList = new ArrayList<Entity_SubEditorPagesAssignments>();
		List<Entity_SubEditedPages> pagesList = new ArrayList<Entity_SubEditedPages>();

		JSONObject subEditor = o.getJSONObject("subEditor");
		Long subEdtitorId = subEditor.getLong("userId");

		Entity_SubEditedPages page = null;
		Long bookPageId = o.getLong("bookPageId");
		JSONArray dateRangeValues = o.getJSONArray("dateRangeValues");
		String date = "";

		try {

			List<String> d = new ArrayList<String>();
			if (dateRangeValues == null) {
				date = getCurrentTimeStamp().toString();
				d.add(date.split(" ")[0]);
			} else {
				if (dateRangeValues.size() > 0)
					for (Object od : dateRangeValues) {
						date = (String) od;
						d.add(date);
					}
			}
			if (subEdtitorId == null)
				return new GenericResponse(2, "you can't add sub-edited page for unidentified user", null);

			pageAssignmentList = (List<Entity_SubEditorPagesAssignments>) getEntityList(
					"From Entity_SubEditorPagesAssignments where subEditorUserId=" + subEdtitorId
							+ " and to_char(dateAssigned ,'YYYY-MM-DD')= '" + d.get(0) + "'").getReturnObject();

			pageAssignment = pageAssignmentList.size() > 0 ? pageAssignmentList.get(0) : null;

			if (pageAssignment == null)
				return new GenericResponse(2,
						"You can't add sub-edited page when you have no assigment from cheif sub-editor on " + d.get(0),
						null);

			pagesList = (List<Entity_SubEditedPages>) getEntityList("From Entity_SubEditedPages where subEdtitorId="
					+ subEdtitorId + " and to_char(subEditedDate ,'YYYY-MM-DD')= '" + d.get(0) + "'").getReturnObject();

			if (pagesList != null)
				return new GenericResponse(0, "page uploaded", pagesList);

			return new GenericResponse(0, "no sub-edited pages found", pagesList);
		} catch (Exception e) {
			e.printStackTrace();
			return new GenericResponse(0, "Errors occured while getting sub-edited pages", null);
		}
	}

	// cheif sub-editor get his/her finished pages
	private GenericResponse getSubEditedpagesByDateForCheifSub(JSONObject o) {
		List<Entity_SubEditedPages> pagesList = new ArrayList<Entity_SubEditedPages>();
		List<Entity_SubEditedPages> pagesListToReturn = new ArrayList<Entity_SubEditedPages>();

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

			pagesList = (List<Entity_SubEditedPages>) getEntityList(
					"From Entity_SubEditedPages where to_char(subEditedDate ,'YYYY-MM-DD')= '" + d_ + "'")
							.getReturnObject();

			if (pagesList == null)
				return new GenericResponse(2, "No pages for date " + d_, null);

			for (Entity_SubEditedPages page : pagesList) {

				if (page.getSubEdtitorId() != null) {
					Entity_Users subEditor = (Entity_Users) getEntityById(Entity_Users.class, page.getSubEdtitorId())
							.getReturnObject();
					page.setSubEditor(subEditor);
				}

				if (page.getBookPageId() != null) {
					Entity_BookPages pa = (Entity_BookPages) getEntityById(Entity_BookPages.class, page.getBookPageId())
							.getReturnObject();
					page.setBookPage(pa);
				}
				pagesListToReturn.add(page);
			}

			if (pagesList != null)
				return new GenericResponse(0, "page uploaded", pagesList);

			return new GenericResponse(0, "no sub-edited pages found", pagesList);
		} catch (Exception e) {
			e.printStackTrace();
			return new GenericResponse(0, "Errors occured while getting sub-edited pages", null);
		}
	}

	// editorial-admin get his/her finished pages

	// get pages for exisisting on a given date
	private GenericResponse getBookPagesExistingForADay(JSONObject o) {

		Entity_SubEditorPagesAssignments pageAssignment = new Entity_SubEditorPagesAssignments();
		List<Entity_SubEditorPagesAssignments> pageAssignmentList = new ArrayList<Entity_SubEditorPagesAssignments>();
		List<Entity_SubEditorPagesAssignments> pageAssignmentListToReturn = new ArrayList<Entity_SubEditorPagesAssignments>();
		Entity_BookPages page = null;
		Long subEdtitorId = o.getLong("subEditorId");
		JSONArray dateRangeValues = o.getJSONArray("dateRangeValues");
		String date = "";
		String d_ = "";

		try {

			List<String> d = new ArrayList<String>();
			if (dateRangeValues == null) {
				date = getCurrentTimeStamp().toString();
				d.add(date.split(" ")[0]);
			} else {
				if (dateRangeValues.size() > 0)
					for (Object od : dateRangeValues) {
						date = (String) od;
						d.add(date);
					}
			}

			if (subEdtitorId == null)
				return new GenericResponse(2, "We have failed to find assignment for unidentified user", null);

			pageAssignmentList = (List<Entity_SubEditorPagesAssignments>) getEntityList(
					"From Entity_SubEditorPagesAssignments where subEditorUserId=" + subEdtitorId
							+ " and to_char(dateAssigned ,'YYYY-MM-DD')='" + d.get(0) + "'").getReturnObject();

			if (pageAssignmentList == null)
				return new GenericResponse(2, "no pages existing on " + d_, null);

			if (pageAssignmentList.size() <= 0)
				return new GenericResponse(2, "no pages existing on " + d_, null);

			for (Entity_SubEditorPagesAssignments pa : pageAssignmentList) {
				if (pa.getPageNumberId() != null)
					page = (Entity_BookPages) getEntityById(Entity_BookPages.class, pa.getPageNumberId())
							.getReturnObject();
				pa.setPage(page);
				pageAssignmentListToReturn.add(pa);
			}
			return new GenericResponse(0, "pages", pageAssignmentList);
		} catch (Exception e) {
			e.printStackTrace();
			return new GenericResponse(0, "Errors occured while uploading file(s)", null);
		}
	}

	private GenericResponse getSubEditorStoryRejectionRequestForchiefSub(JSONObject o) {
		ReportingRS reporter = new ReportingRS();
		Entity_EditedStories editedStory = null;
		List<Entity_EditedStories> editedStoriesList = new ArrayList<Entity_EditedStories>();
		Long storySubEditorialApproval = o.getLong("storySubEditorialApproval");
		Entity_Users storySubEditor = null;
		Entity_BookPages page = null;
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
			if (d.get(1) == null) {
				editedStoriesList = (List<Entity_EditedStories>) getEntityList(
						"From Entity_EditedStories where to_char(dateOfSubApprovalStatus ,'YYYY-MM-DD')= '" + d.get(0)
								+ "' and storySubEditorialApproval =1 and subEditorApproval=" + -1
								+ " and eStoryId IN (Select max(eStoryId) From Entity_EditedStories group by reportedStoryId)")
										.getReturnObject();
			} else {
				editedStoriesList = (List<Entity_EditedStories>) getEntityList(
						"From Entity_EditedStories where to_char(dateEdited ,'YYYY-MM-DD') between  '" + d.get(0)
								+ "' and storySubEditorialApproval =1 and subEditorApproval=" + -1
								+ " and eStoryId IN (Select max(eStoryId) From Entity_EditedStories group by reportedStoryId)")
										.getReturnObject();
			}
			if (editedStoriesList == null)
				return new GenericResponse(99, "No stories found", null);

			if (editedStoriesList.size() > 0) {
				for (Entity_EditedStories es : editedStoriesList) {

					if (es.getReportedStoryId() != null)
						es.setOriginalStory(getReportedStoryById(es.getReportedStoryId()));

					// sub-editor
					if (es.getSubEditorUserId() != null) {
						storySubEditor = (Entity_Users) getEntityById(Entity_Users.class, es.getSubEditorUserId())
								.getReturnObject();
						es.setStorySubEditor(storySubEditor);

						// page number
						if (es.getPageNumberId() != null)
							page = (Entity_BookPages) getEntityById(Entity_BookPages.class, es.getPageNumberId())
									.getReturnObject();
						es.setPage(page);
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

	private GenericResponse markStorySubEditorApprovalStatus(JSONObject o) {
		Entity_EditedStories editedStory = null;
		Entity_ReportedStories reportedStory = null;
		JSONObject storySelected = o.getJSONObject("storySelected");

		try {
			if (storySelected == null)
				return new GenericResponse(99, "Technicle occured while processing action. Contact admin for help",
						null);
			Long eStoryId = storySelected.getLong("eStoryId");
			Long reportedStoryId = storySelected.getLong("reportedStoryId");
			if (reportedStoryId == null)
				return new GenericResponse(99, "Details missing to complete this action", null);
			if (eStoryId == null)
				return new GenericResponse(99, "Details missing to complete this action", null);

			editedStory = (Entity_EditedStories) getEntityById(Entity_EditedStories.class, eStoryId).getReturnObject();

			reportedStory = (Entity_ReportedStories) getEntityById(Entity_ReportedStories.class, reportedStoryId)
					.getReturnObject();

			if ((editedStory != null) && (reportedStory != null)) {
				editedStory.setSubEditorApproval(storySelected.getLong("subEditorApproval"));
				editedStory.setDateOfSubApprovalStatus(getCurrentTimeStamp());
				reportedStory.setUpdatedOn(getCurrentTimeStamp());
				if (!saveEntity(editedStory))
					return new GenericResponse(99, "Failed to mark story as approved/rejected", null);

				reportedStory.setStorySubEditorialApproval(o.getLong("storySubEditorialApproval"));
				reportedStory.setUpdatedOn(getCurrentTimeStamp());
				if (!saveEntity(reportedStory))
					return new GenericResponse(99, "Failed to mark story as approved/rejected", null);
			}
			return new GenericResponse(0, "Story rejected action completed", editedStory);
		} catch (Exception e) {
			e.printStackTrace();
			return new GenericResponse(99, "Errors occured while processing action", null);
		}
	}

	private GenericResponse assignStoriesPageAndPageToSubEditor(JSONObject o) {
		Entity_BookPages pageNumber = null;
		Entity_EditedStories editedStory = null;
		Entity_Users subEditor = null;
		Entity_ReportedStories reportedStory = null;
		Entity_SubEditorPagesAssignments pageAssignment = null;
		List<Entity_EditedStories> editedStoriesList = new ArrayList<Entity_EditedStories>();
		List<Entity_SubEditorPagesAssignments> pageAssignedList = new ArrayList<Entity_SubEditorPagesAssignments>();
		List<Entity_SubEditorPagesAssignments> pageAssignmentList = new ArrayList<Entity_SubEditorPagesAssignments>();
		Long subEditorUserId = o.getLong("subEditorUserId");
		Long cSubEditorUserId = o.getLong("cSubEditorUserId");
		Long pageNumberId = o.getLong("pageNumberId");
		JSONArray storiesArray = o.getJSONArray("storiesArray");
		try {
			String date = getCurrentTimeStamp().toString();
			String[] d = date.split(" ");
			String d_ = d[0];
			if (storiesArray == null)
				return new GenericResponse(99, "No stories to assign!! please contact admin for help", null);
			if (storiesArray.size() <= 0)
				return new GenericResponse(99, "No stories to assign!! please contact admin for help", null);

			if (cSubEditorUserId == null)
				return new GenericResponse(99, "Can't enable assigning story by un identified chief sub editor", null);

			if (subEditorUserId == null)
				return new GenericResponse(99, "Can't enable assigning story by un identified sub editor", null);

			subEditor = (Entity_Users) getEntityById(Entity_Users.class, subEditorUserId).getReturnObject();
			if (subEditor == null)
				return new GenericResponse(99, "cant assign story Identified but unexsiting sub editor.", null);

			if (pageNumberId == null)
				throw new DauCentralException("No stories selected to assign");
			pageNumber = (Entity_BookPages) getEntityById(Entity_BookPages.class, pageNumberId).getReturnObject();

			if (pageNumber == null)
				return new GenericResponse(99, "Can't alocate stories to undefined page number", null);

			pageAssignmentList = (List<Entity_SubEditorPagesAssignments>) getEntityList(
					"From Entity_SubEditorPagesAssignments where pageNumberId=" + pageNumberId
							+ " and to_char(dateAssigned ,'YYYY-MM-DD')= '" + d_ + "'").getReturnObject();

			pageAssignment = pageAssignmentList.size() > 0 ? pageAssignmentList.get(0) : null;

			if (pageAssignment != null) {
				Long _subEditorUserId = pageAssignment.getSubEditorUserId();
				if (!_subEditorUserId.equals(subEditorUserId)) {
					subEditor = (Entity_Users) getEntityById(Entity_Users.class, pageAssignment.getSubEditorUserId())
							.getReturnObject();
					return new GenericResponse(99, "Page has already been assigned to another sub editor "
							+ subEditor.getFirstName() + " " + subEditor.getLastName(), null);
				}
			} else {
				// creating new story page for the day
				pageAssignment = new Entity_SubEditorPagesAssignments();
				pageAssignment.setPageNumberId(pageNumberId);
				pageAssignment.setSubEditorUserId(subEditorUserId);
				pageAssignment.setChiefSubEditorUserId(cSubEditorUserId);
				pageAssignment.setDateAssigned(getCurrentTimeStamp());
				if (saveEntity(pageAssignment)) {
					pageAssignedList.add(pageAssignment);
				}
			}

			// assign stories to a page
			for (Object ob : storiesArray) {
				JSONObject os = (JSONObject) ob;
				Long eStoryId = os.getLong("eStoryId");
				Long reportedStoryId = null;
				if (eStoryId != null)
					editedStory = (Entity_EditedStories) getEntityById(Entity_EditedStories.class, eStoryId)
							.getReturnObject();
				if (editedStory != null) {

					editedStory.setPageNumberId(pageNumberId);
					editedStory.setStorySubEditorialApproval(1L);
					editedStory.setSubEditorApproval(1L);
					editedStory.setSubEditorUserId(subEditorUserId);
					editedStory.setChiefSubToSubAssignmentDate(getCurrentTimeStamp());
					editedStory.setDateChiefOfSubApprovalStatus(getCurrentTimeStamp());
					//editedStory.setUpdatedOn(getCurrentTimeStamp());
					if (saveEntity(editedStory)) {
						editedStoriesList.add(editedStory);

						reportedStoryId = editedStory.getReportedStoryId();

						if (reportedStoryId != null)
							reportedStory = (Entity_ReportedStories) getEntityById(Entity_ReportedStories.class,
									reportedStoryId).getReturnObject();

						if (reportedStory != null) {
							reportedStory.setStorySubEditorialApproval(1L);
							reportedStory.setDateSubEditorialApproval(getCurrentTimeStamp());
							reportedStory.setUpdatedOn(getCurrentTimeStamp());
							saveEntity(reportedStory);
						}
					}
				}

				if (reportedStoryId != null)
					editedStory = (Entity_EditedStories) getEntityById(Entity_EditedStories.class, eStoryId)
							.getReturnObject();
			}
			sendEmailNotification(
					subEditor.getUsername(), "Hello " + subEditor.getFirstName().toUpperCase()
							+ ",\n You have been assigned to sub edit page " + pageNumber.getPageNumber(),
					"E-EDITORIAL PAGE ASSIGNMENT");

			return new GenericResponse(0, "page to sub editor assigned sucessfully", pageAssignedList);

		} catch (DauCentralException e) {
			e.printStackTrace();
			return new GenericResponse(99, "Error occured while pages to sub-editor", null);
		} catch (UnsupportedEncodingException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return new GenericResponse(99, "Error occured while pages to sub-editor", null);
	}

	private GenericResponse saveSubEditorialComments(JSONObject o) {
		Long storyId = o.getLong("storyId");
		JSONObject user = o.getJSONObject("user");
		Long userId = user.getLong("userId");
		String lastName = user.getString("lastName");
		String firstName = user.getString("firstName");
		Entity_Users cheifSub = null;

		JSONArray obAdressesArray = o.getJSONArray("storyReporterEmailAddresses");
		String role = user.getString("role");
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

			// check if it sub or chief sub-editor
			if (role == "chief subeditor") {
				if (obAdressesArray.size() > 0)
					for (Object ob : obAdressesArray) {
						String reporterEmail = (String) ob;
						sendEmailNotification(reporterEmail, o.getString("comment"), firstName.toUpperCase() + " "
								+ lastName.toUpperCase() + " OF SUB EDITRIAL REJECTED YOUR STORY");
					}
			} else {

				// email to chief sub if it is sub commenting
				Long chiefSubEditorUserId = o.getLong("chiefSubEditorUserId");
				if (chiefSubEditorUserId != null)
					cheifSub = (Entity_Users) getEntityById(Entity_Users.class, chiefSubEditorUserId).getReturnObject();
				if (cheifSub != null) {
					if (cheifSub.getUsername() != null)
						sendEmailNotification(cheifSub.getUsername(), o.getString("comment"), firstName.toUpperCase()
								+ " " + lastName.toUpperCase() + " IS REQUESTING TO REJECTED A STORY");
				}
			}
			return new GenericResponse(0, "comment added sucessgully", c);
		} catch (Exception e) {
			e.printStackTrace();
			return new GenericResponse(99, "Failed to add comment", null);
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
}
