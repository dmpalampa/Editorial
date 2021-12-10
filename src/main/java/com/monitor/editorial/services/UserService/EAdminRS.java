package com.monitor.editorial.services.UserService;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.monitor.editorial.Core.DauCentralException;
import com.monitor.editorial.Core.GenericResponse;
import com.monitor.editorial.entities.Entity_ReportedStories;
import com.monitor.editorial.entities.Entity_ReportedStoryFiles;
import com.monitor.editorial.entities.Entity_UserReportedStories;
import com.monitor.editorial.entities.Entity_Users;
import com.monitor.editorial.services.LocalCoreObject;

public class EAdminRS extends LocalCoreObject {

	public GenericResponse editorialAdminService(JSONObject o, String request) {

		if (request.equals("getNumberOfStoriesSubmittedByReporterInAMonth")) {
			return getNumberOfStoriesSubmittedByReporterInAMonth(o);
		}
		if (request.equals("getReportersWithStoryCountBetweenStoryDateRange")) {
			return getReportersWithStoryCountBetweenStoryDateRange(o);
		}
		if (request.equals("getReporterStoriesOfAllCategoryBetweenDateRanges")) {
			return getReporterStoriesOfAllCategoryBetweenDateRanges(o);
		}
		return null;
	}

	@SuppressWarnings("unchecked")
	private GenericResponse getReporterStoriesOfAllCategoryBetweenDateRanges(JSONObject o) {
		List<Entity_ReportedStories> reportedStoriesListToReturn = new ArrayList<Entity_ReportedStories>();
		List<Entity_ReportedStories> reportedStoriesList = new ArrayList<Entity_ReportedStories>();
		List<Entity_Users> reportersListToReturn = new ArrayList<Entity_Users>();
		List<Entity_Users> reportersList = new ArrayList<Entity_Users>();
		String date = "";
		String d_ = "";
		JSONArray dateRangeValues = o.getJSONArray("dateRangeValues");
		Long reporterId = o.getLong("reporterId");
		List<Entity_ReportedStories> ListOfSubmittedStories = new ArrayList<Entity_ReportedStories>();
		List<Entity_ReportedStories> ListOfEditorialRejectedStories = new ArrayList<Entity_ReportedStories>();
		List<Entity_ReportedStories> ListOfSubEditorialRejectedStories = new ArrayList<Entity_ReportedStories>();
		List<Entity_ReportedStories> listOfPublishedStories = new ArrayList<Entity_ReportedStories>();
		List<Entity_ReportedStories> ListOfStoriesIgnoredBySubEditorial = new ArrayList<Entity_ReportedStories>();

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

			reportersList = (List<Entity_Users>) getEntityList("From Entity_Users where role='reporter'")
					.getReturnObject();

			if (reportersList != null) {
				for (Entity_Users reporter : reportersList) {

					String queryPart = "";
					if (d.get(1) != null) {
						queryPart = "From Entity_ReportedStories"
								+ " where storyId IN (Select storyId from Entity_UserReportedStories where userId="
								+ reporter.getUserId() + ") and  to_char(dateSubmitted ,'YYYY-MM-DD') between '"
								+ d.get(0) + "' and '" + d.get(1) + "' ";
					} else {
						queryPart = "From Entity_ReportedStories"
								+ " where storyId IN (Select storyId from Entity_UserReportedStories where userId="
								+ reporter.getUserId() + ") and  to_char(dateSubmitted ,'YYYY-MM-DD') ='" + d.get(0)
								+ "' ";
					}

					// get number of stories submitted
					ListOfSubmittedStories = (List<Entity_ReportedStories>) getEntityList(queryPart).getReturnObject();

					// get number of stories rejected by editorial
					ListOfEditorialRejectedStories = (List<Entity_ReportedStories>) getEntityList(
							queryPart + " and editorialApproval=-1").getReturnObject();

					// get number of stories rejected
					ListOfSubEditorialRejectedStories = (List<Entity_ReportedStories>) getEntityList(
							queryPart + " and storySubEditorialApproval=-1").getReturnObject();

					// get number of stories published
					listOfPublishedStories = (List<Entity_ReportedStories>) getEntityList(
							queryPart + " and storySubEditorialApproval=1 ").getReturnObject();

					// get number of stories published
					ListOfStoriesIgnoredBySubEditorial = (List<Entity_ReportedStories>) getEntityList(
							queryPart + " and storySubEditorialApproval=0 ").getReturnObject();

					reporter.setSubmittedStoriesList(ListOfSubmittedStories);
					reporter.setPublishedStoriesList(listOfPublishedStories);
					reporter.setEditorialRejectedList(ListOfEditorialRejectedStories);
					reporter.setSubEditorialRejectedList(ListOfSubEditorialRejectedStories);
					reporter.setNumberOftoriesSubEditorialIgnoredList(ListOfStoriesIgnoredBySubEditorial);
					reportersListToReturn.add(reporter);
				}
				return new GenericResponse(0, "reporters story count", reportersListToReturn);
			}

			if (reportersListToReturn == null)
				return new GenericResponse(0, "no stories found", null);

			return new GenericResponse(0, "stories", reportedStoriesListToReturn);
		} catch (Exception e) {
			e.printStackTrace();
			return new GenericResponse(99, "Errors occured while fetching stories", null);
		}
		// get number of stories rejected
	}

	// get number of stories submitted
	private GenericResponse getNumberOfStoriesSubmittedByReporterInAMonth(JSONObject o) {
		List<Entity_ReportedStories> reportedStoriesListToReturn = new ArrayList<Entity_ReportedStories>();
		List<Entity_ReportedStories> reportedStoriesList = new ArrayList<Entity_ReportedStories>();
		List<Entity_Users> reportersListToReturn = new ArrayList<Entity_Users>();
		List<Entity_Users> reportersList = new ArrayList<Entity_Users>();
		String date = "";
		String d_ = "";
		String month = o.getString("month");
		Long reporterId = o.getLong("reporterId");

		try {
			if (month == null)
				return new GenericResponse(99, "Supply date(s) and try again", null);

			if (month.equals(""))
				return new GenericResponse(99, "Supply date(s) and try again", null);

			reportersList = (List<Entity_Users>) getEntityList("From Entity_Users where role='reporter'")
					.getReturnObject();

			if (reportersList != null) {
				for (Entity_Users reporter : reportersList) {

					String hqlCountStoriesReportedInAMonth = "Select count(*) From Entity_ReportedStories"
							+ " where storyId IN (Select storyId from Entity_UserReportedStories where userId="
							+ reporter.getUserId() + ") and to_char(dateSubmitted ,'YYYY-MM') ='" + month + "'";

					// get number of stories submitted
					Long NumberOfSubmittedStories = getEntityCount(hqlCountStoriesReportedInAMonth);

					// get number of stories rejected by editorial
					Long NumberOfEditorialRejectedStories = getEntityCount(
							hqlCountStoriesReportedInAMonth + " and editorialApproval=-1 ");

					// get number of stories rejected
					Long NumberOfSubEditorialRejectedStories = getEntityCount(
							hqlCountStoriesReportedInAMonth + " and storySubEditorialApproval=-1 ");

					// get number of stories published
					Long NumberOfPublishedStories = getEntityCount(
							hqlCountStoriesReportedInAMonth + " and editorialApproval=1 and storySubEditorialApproval=1");

					Long NumberOfStoriesIgnoredBySubEditorial = getEntityCount(
							hqlCountStoriesReportedInAMonth + "and editorialApproval=1 and storySubEditorialApproval=0");

					reporter.setSubmittedStories(NumberOfSubmittedStories);
					reporter.setPublishedStories(NumberOfPublishedStories);
					reporter.setEditorialRejected(NumberOfEditorialRejectedStories);
					reporter.setSubEditorialRejected(NumberOfSubEditorialRejectedStories);
					reporter.setNumberOftoriesSubEditorialIgnored(NumberOfStoriesIgnoredBySubEditorial);
					reportersListToReturn.add(reporter);
				}
				return new GenericResponse(0, "reporters story count", reportersListToReturn);
			}

			if (reportersListToReturn == null)
				return new GenericResponse(0, "no stories found", null);

			return new GenericResponse(0, "stories", reportedStoriesListToReturn);
		} catch (Exception e) {
			e.printStackTrace();
			return new GenericResponse(99, "Errors occured while fetching stories", null);
		}
		// get number of stories rejected
	}

	private GenericResponse getNumberOfStoriesSubmittedByReporterInAYear(JSONObject o) {
		return null;
	}

	private GenericResponse getReportersWithStoryCountBetweenStoryDateRange(JSONObject o) {
		List<Entity_ReportedStories> reportedStoriesListToReturn = new ArrayList<Entity_ReportedStories>();
		List<Entity_ReportedStories> reportedStoriesList = new ArrayList<Entity_ReportedStories>();
		List<Entity_Users> reportersListToReturn = new ArrayList<Entity_Users>();
		List<Entity_Users> reportersList = new ArrayList<Entity_Users>();
		String date = "";
		String d_ = "";
		JSONArray dateRangeValues = o.getJSONArray("dateRangeValues");
		Long reporterId = o.getLong("reporterId");
		Long NumberOfSubmittedStories = null;
		Long NumberOfEditorialRejectedStories = null;
		Long NumberOfSubEditorialRejectedStories = null;
		Long NumberOfPublishedStories = null;
		Long NumberOfStoriesIgnoredBySubEditorial = null;

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

			reportersList = (List<Entity_Users>) getEntityList("From Entity_Users where role='reporter'")
					.getReturnObject();

			if (reportersList != null) {
				for (Entity_Users reporter : reportersList) {
					String storyCountQueryForDateRange = "";
					if (d.get(1) != null) {
						storyCountQueryForDateRange = "Select count(*) From Entity_ReportedStories"
								+ " where storyId IN (Select storyId from Entity_UserReportedStories where userId="
								+ reporter.getUserId() + ") and  to_char(dateSubmitted ,'YYYY-MM-DD') between '"
								+ d.get(0) + "' and '" + d.get(1) + "' ";
					} else {

						storyCountQueryForDateRange = "Select count(*) From Entity_ReportedStories"
								+ " where storyId IN (Select storyId from Entity_UserReportedStories where userId="
								+ reporter.getUserId() + ") and to_char(dateSubmitted ,'YYYY-MM-DD') ='" + d.get(0)
								+ "' ";
					}
					// get number of stories submitted
					NumberOfSubmittedStories = getEntityCount(storyCountQueryForDateRange);

					// get number of stories rejected by editorial
					NumberOfEditorialRejectedStories = getEntityCount(
							storyCountQueryForDateRange + "and editorialApproval=-1");

					// get number of stories rejected
					NumberOfSubEditorialRejectedStories = getEntityCount(
							storyCountQueryForDateRange + "and storySubEditorialApproval=-1");

					// get number of stories published
					NumberOfPublishedStories = getEntityCount(
							storyCountQueryForDateRange + "and storySubEditorialApproval=1 ");

					// get number of stories published
					NumberOfStoriesIgnoredBySubEditorial = getEntityCount(
							storyCountQueryForDateRange + "and storySubEditorialApproval=0");

					reporter.setSubmittedStories(NumberOfSubmittedStories);
					reporter.setPublishedStories(NumberOfPublishedStories);
					reporter.setEditorialRejected(NumberOfEditorialRejectedStories);
					reporter.setSubEditorialRejected(NumberOfSubEditorialRejectedStories);
					reporter.setNumberOftoriesSubEditorialIgnored(NumberOfStoriesIgnoredBySubEditorial);
					reportersListToReturn.add(reporter);
				}
					return new GenericResponse(0, "reporters story count", reportersListToReturn);
				
			}

			if (reportersListToReturn == null)
				return new GenericResponse(0, "no stories found", null);

			return new GenericResponse(0, "stories", reportedStoriesListToReturn);
		} catch (

		Exception e) {
			e.printStackTrace();
			return new GenericResponse(99, "Errors occured while fetching stories", null);
		}
		// get number of stories rejected
	}

}
