package com.monitor.editorial.services;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.MultivaluedMap;

import org.glassfish.jersey.media.multipart.FormDataContentDisposition;
import org.glassfish.jersey.media.multipart.FormDataParam;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.monitor.editorial.Core.DauCentralException;
import com.monitor.editorial.Core.GenericResponse;
import com.monitor.editorial.services.CommentingService.StoryCommentRS;
import com.monitor.editorial.services.UserService.AuthenticationRS;
import com.monitor.editorial.services.UserService.EditingRS;
import com.monitor.editorial.services.UserService.ReportingRS;
import com.monitor.editorial.services.UserService.SubEditingRS;
import com.monitor.editorial.services.UserService.EAdminRS;
import com.monitor.editorial.services.UserService.UsersRS;

/**
 * Root resource (exposed at "myresource" path)
 */

@Path("user_service")
public class MainService {
	private static final String UPLOAD_FOLDER = "c:/uploadedFiles/";

	@GET
	@Produces(MediaType.TEXT_PLAIN)
	public String sayPlainTextHello() {
		return "Hello Jersey";
	}

	/**
	 * Method handling HTTP GET requests. The returned object will be sent to the
	 * client as "text/plain" media type.
	 *
	 * @return String that will be returned as a text/plain response.
	 * 
	 */
	@POST
	@Path("/AllService")
	@Produces(MediaType.APPLICATION_JSON)
	public String getIt(InputStream incomingData) {

		String postData = readPostData(incomingData);

		JSONObject dataObject = JSON.parseObject(postData);

		String service = dataObject.getString("service");
		String authenticationToken = dataObject.getString("authenticationToken");
		String requestType = dataObject.getString("requestType");
		JSONObject requestData = dataObject.getJSONObject("requestData");

		GenericResponse response = new GenericResponse();
		try {
			AuthenticationRS userAuth = new AuthenticationRS();
			if (authenticationToken == null || authenticationToken == "") {
				response = userAuth.loggin(requestData);

			} else {
				if (userAuth.checkUserAuthentication(authenticationToken)) {
					switch (service) {
					case "UsersRS":
						UsersRS user = new UsersRS();
						response = user.UserService(requestData, requestType);
						break;
					case "ReportingRS":
						ReportingRS reporter = new ReportingRS();
						response = reporter.UserService(requestData, requestType);
						break;
					case "EditingRS":
						EditingRS edit = new EditingRS();
						response = edit.EditingService(requestData, requestType);
						break;
					case "SubEditingRS":
						SubEditingRS suEdit = new SubEditingRS();
						response = suEdit.subEditingService(requestData, requestType);
						break;
					case "EAdminRS":
						EAdminRS editorialAdmin= new EAdminRS();
						response = editorialAdmin.editorialAdminService(requestData, requestType);
						break;
					case "StoryCommentRS":
						StoryCommentRS comment = new StoryCommentRS();
						response = comment.CommentService(requestData, requestType);
						break;
					case "AuthenticationRS":
						response = userAuth.UserService(requestData, requestType);
						break;
					default:
						break;
					}
				}
				else {
					response.setReturnMessage("Authentication failed. Login again");
					response.setReturnCode(212);
				}
			}

		} catch (Exception e) {
			e.printStackTrace();
			response.setReturnMessage("Error Processing request " + e);
			response.setReturnCode(202);
		}
		return JSON.toJSONString(response, true);
	}

	@POST
	@Path("/UploadExcel")
	@Consumes(MediaType.MULTIPART_FORM_DATA)
	@Produces(MediaType.APPLICATION_JSON)
	public String uploadFile(@FormDataParam("file") InputStream uploadedInputStream,
			@FormDataParam("file") FormDataContentDisposition fileDetail,
			@FormDataParam("data") String data) {

		System.out.println(data);
		GenericResponse response = new GenericResponse();

		// check if all form parameters are provided
		if (uploadedInputStream == null || fileDetail == null) {
			response.setReturnMessage("Invalid form data");
			response.setReturnCode(202);
			return JSON.toJSONString(response, true);
		}

		// create our destination folder, if it not exists
		try {
			createFolderIfNotExists(UPLOAD_FOLDER);
		} catch (SecurityException se) {

			response.setReturnMessage("Can not create destination folder on server");
			response.setReturnCode(202);
			return JSON.toJSONString(response, true);
		}

		String uploadedFileLocation = UPLOAD_FOLDER + fileDetail.getFileName();
		
		File f = new File(uploadedFileLocation);
		if (f.exists() && !f.isDirectory()) {
			response.setReturnMessage("File already exists " + uploadedFileLocation);
			response.setReturnCode(202);
			return JSON.toJSONString(response, true);
		}

		try {
			saveToFile(uploadedInputStream, uploadedFileLocation);
			response.setReturnMessage("Saved successfully " + uploadedFileLocation);
			response.setReturnCode(202);
		} catch (IOException e) {
			response.setReturnMessage("Can not save file");
			response.setReturnCode(202);
			return JSON.toJSONString(response, true);
		}

		return JSON.toJSONString(response, true);
	}

	private void saveToFile(InputStream inStream, String target) throws IOException {
		OutputStream out = null;
		int read = 0;
		byte[] bytes = new byte[1024];
		out = new FileOutputStream(new File(target));
		while ((read = inStream.read(bytes)) != -1) {
			out.write(bytes, 0, read);
		}
		out.flush();
		out.close();
	}

	private void createFolderIfNotExists(String dirName) throws SecurityException {
		File theDir = new File(dirName);
		if (!theDir.exists()) {
			theDir.mkdir();
		}
	}

	/**
	 *
	 * @param incomingData
	 * @return
	 */
	protected String readPostData(InputStream incomingData) {
		StringBuilder crunchifyBuilder = new StringBuilder();
		try {
			BufferedReader in = new BufferedReader(new InputStreamReader(incomingData));
			String line = null;
			while ((line = in.readLine()) != null) {
				crunchifyBuilder.append(line);
			}
		} catch (Exception e) {
			System.out.println("Error Parsing: - ");
		}
		return crunchifyBuilder.toString();
	}

}
