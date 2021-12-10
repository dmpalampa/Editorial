package com.monitor.editorial.services.UserService;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import com.alibaba.fastjson.JSONObject;
import com.monitor.editorial.Core.DauCentralException;
import com.monitor.editorial.Core.GenericResponse;
import com.monitor.editorial.entities.Entity_LogginSessions;
import com.monitor.editorial.entities.Entity_Permissions;
import com.monitor.editorial.entities.Entity_StoryCategory;
import com.monitor.editorial.entities.Entity_Users;
import com.monitor.editorial.services.LocalCoreObject;

import java.util.Properties;
import javax.naming.AuthenticationException;
import javax.naming.Context;
import javax.naming.NamingEnumeration;
import javax.naming.NamingException;
import javax.naming.directory.*;
import javax.naming.ldap.LdapContext;

public class AuthenticationRS extends LocalCoreObject {
	
	DirContext connection;

	public GenericResponse UserService(JSONObject o, String request) {

		if (request.equals("logOutSessions")) {
			return logOutSessions(o);
		}

		return null;
	}
	

	public void newConnection() {
		Properties env = new Properties();
		env.put(Context.INITIAL_CONTEXT_FACTORY, "com.sun.jndi.ldap.LdapCtxFactory");
		env.put(Context.PROVIDER_URL, "ldap://172.17.0.2:389");
		env.put(Context.SECURITY_PRINCIPAL, "dmpalampa@ug.nationmedia.com");
		env.put(Context.SECURITY_CREDENTIALS, "uganda@10");
		env.put(Context.REFERRAL, "follow@10");
		try {
			connection = new InitialDirContext(env);
			System.out.println("Hello World!" + connection);
		} catch (AuthenticationException ex) {
			System.out.println(ex.getMessage());
		} catch (NamingException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	
	
	//LDAP Authentication
	public void searchUsers() throws NamingException {
		String searchFilter = "(uid=jjrukundo)"; //  for one user
		//String searchFilter = "(&(uid=1)(cn=Smith))"; // and condition 
		//String searchFilter = "(|(uid=1)(uid=2)(cn=dmpalampa))"; // or condition
		String[] reqAtt = { "cn", "sn","uid" };
		SearchControls controls = new SearchControls();
		controls.setSearchScope(SearchControls.SUBTREE_SCOPE);
		controls.setReturningAttributes(reqAtt);

		NamingEnumeration users = connection.search("OU=users, OU=mpl, OU=editorial, DC=uganda, DC=nationmedia, DC=com", searchFilter, controls);

		SearchResult result = null;
		System.out.println(users);
		while (users.hasMore()) {
			result = (SearchResult) users.next();
			Attributes attr = result.getAttributes();
			String name = attr.get("cn").get(0).toString();
			System.out.println(name);
			//deleteUserFromGroup(name,"Administrators");
			System.out.println(attr.get("cn"));
			System.out.println(attr.get("sn"));
			System.out.println(attr.get("uid"));
		}

	}

	public Boolean checkUserAuthentication(String authToken) throws NamingException {
		
		//newConnection();
	///	searchUsers();
	//	return true;
		List<Entity_LogginSessions> lsessionList = new ArrayList<Entity_LogginSessions>();

		Entity_LogginSessions lsession = null;
		String message = "";
		try {
			if (authToken != null || authToken != "") {
				lsessionList = (List<Entity_LogginSessions>) getEntityList(
						"From Entity_LogginSessions where tokenNumber='" + authToken + "'").getReturnObject();

				lsession = lsessionList.size() > 0 ? lsessionList.get(0) : null;

				if (lsession != null)
					return true;
				return false;
			} else {
				return false;
			}

		} catch (Exception e) {
			e.printStackTrace();
			return false;
		}
	}

	public GenericResponse loggin(JSONObject o) {
		List<Entity_Users> userList = new ArrayList<Entity_Users>();
		Entity_Users user = null;
		Object obj = new Object();
		String userName = o.getString("username");
		if (userName != null)
			if (userName.indexOf("@ug.nationmedia.com") == -1) {
				userName = userName + "@ug.nationmedia.com";
			}
		try {
			userList = (List<Entity_Users>) getEntityList("From Entity_Users where username='" + userName
					+ "' and password ='" + o.getString("password") + "' and status=true").getReturnObject();

			if (userList != null)
				user = userList.size() > 0 ? userList.get(0) : null;

			if (user == null)
				return new GenericResponse(90, "Incorrect user or password was entered", null);

			user.setAuthenticationToken(createLogginSession(user.getUsername(), user.getUserId()));

			Set<Entity_Permissions> set = new HashSet<Entity_Permissions>(getRolePermission(user.getRoleId()));

			user.setPermissionsList(set);
			if (user.getEditorOfCategory() != null)
				user.setEditorOfCategoryEntity(getStoryCategoryById(user.getEditorOfCategory()));

			return new GenericResponse(0, "loggin sucessgully", user);
		} catch (Exception e) {
			return new GenericResponse(99, "Loggin failed" + e, user);
		}
	}

	private List<Entity_Permissions> getRolePermission(Long roleId) {
		try {
			return (List<Entity_Permissions>) getManyEntitiesByField(Entity_Permissions.class, "roleId", roleId);
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}
	}

	private String createLogginSession(String username, Long userId) {
		List<Entity_LogginSessions> lsessionList = new ArrayList<Entity_LogginSessions>();
		String authToken = "";
		Entity_LogginSessions lsession = null;
		String message = "";
		try {

			lsessionList = (List<Entity_LogginSessions>) getEntityList("From Entity_LogginSessions where username='"
					+ username + "' and status =" + true + " and userId=" + userId + "").getReturnObject();

			lsession = lsessionList.size() > 0 ? lsessionList.get(0) : null;

			if (lsession != null) {
				lsession.setStatus(false);
				saveEntity(lsession);
			}
			authToken = generateNewToken();
			if (authToken.length() > 0) {
				lsession = new Entity_LogginSessions();
				lsession.setUsername(username);
				lsession.setTokenNumber(authToken);
				lsession.setUserId(userId);
				lsession.setStatus(true);

				if (!saveEntity(lsession))
					throw new DauCentralException("failed to create session");

				return authToken;
			}

			return "";

		} catch (DauCentralException e) {
			e.printStackTrace();
			return "failed to create session";
		}
	}

	private GenericResponse logOutSessions(JSONObject o) {
		List<Entity_LogginSessions> lsessionList = new ArrayList<Entity_LogginSessions>();
		String authToken = "";
		Entity_LogginSessions lsession = null;
		String message = "";
		try {

			lsessionList = (List<Entity_LogginSessions>) getEntityList("From Entity_LogginSessions where username='"
					+ o.getString("username") + "' and status =" + true + " and userId=" + o.getLong("userId") + "")
							.getReturnObject();
			lsession = lsessionList.size() > 0 ? lsessionList.get(0) : null;

			if (lsession == null)
				throw new DauCentralException("such session doesn't exist");
			lsession.setStatus(false);
			lsession.setLogoutTime(getCurrentTimeStamp());

			if (!saveEntity(lsession))
				throw new DauCentralException("error occured when logging out session");
			return new GenericResponse(0, "logout session succeeded", null);

		} catch (DauCentralException e) {
			e.printStackTrace();
			return new GenericResponse(99, "failed to logout session", null);
		}
	}

	private Entity_StoryCategory getStoryCategoryById(Long catId) {
		Entity_StoryCategory cat = null;
		try {
			if (catId == null)
				throw new DauCentralException("Can't get un identified category");
			cat = (Entity_StoryCategory) getEntityById(Entity_StoryCategory.class, catId).getReturnObject();
			if (cat == null)
				throw new DauCentralException("Identified category not found. Contact Admin for help");

			return cat;
		} catch (DauCentralException e) {
			e.printStackTrace();
			return null;
		}
	}
}
