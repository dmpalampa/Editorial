package com.monitor.editorial.services.UserService;

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
import com.monitor.editorial.entities.Entity_Permissions;
import com.monitor.editorial.entities.Entity_Roles;
import com.monitor.editorial.entities.Entity_StoryCategory;
import com.monitor.editorial.entities.Entity_Users;
import com.monitor.editorial.services.LocalCoreObject;

public class UsersRS extends LocalCoreObject {

	public GenericResponse UserService(JSONObject o, String request) {

		if (request.equals("saveUser")) {
			return saveUser(o);
		}
		if (request.equals("getAllUsers")) {
			return getAllUser();
		}
		if (request.equals("getUserRoles")) {
			return getUserRoles();
		}
		if (request.equals("getUserById")) {
			return getUserById(o);
		}
		if (request.equals("saveUserRoles")) {
			return saveUserRoles(o);
		}
		if (request.equals("deleteRolePermissions")) {
			return deleteRolePermissions(o);
		}
		if (request.equals("changePassword")) {
			return changePassword(o);
		}
		if (request.equals("changeUserActivityStatus")) {
			return changeUserActivityStatus(o);
		}
		if (request.equals("changeUserRole")) {
			return changeUserRole(o);
		}
		if (request.equals("getUserByUserName")) {
			return getUserByUserName(o);
		}
		if (request.equals("getUsersByRole")) {
			return getUsersByRole(o);
		}
		if (request.equals("getUserByAnyFeild")) {
			return getUserByAnyFeild(o);
		}
		if (request.equals("userChangeHisOwnPassword")) {
			return userChangeHisOwnPassword(o);
		}
		
		return null;
	}

	private GenericResponse saveUser(JSONObject o) {
		Entity_Users u = null;
		List<Entity_Users> ul = new ArrayList<Entity_Users>();
		Long userId = o.getLong("userId");
		String userName = o.getString("userName");
		JSONObject ob = o.getJSONObject("userRole");
		JSONObject obc = o.getJSONObject("storyCategory");
		Boolean newUser = false;

		Long sCategoryId = null;
		if (obc != null)
			sCategoryId = obc.getLong("sCategoryId");

		try {
			if (userName == "")
				return new GenericResponse(99, "Can't add user without a username/email.", null);

			if (userId != null) {
				u = (Entity_Users) getEntityById(Entity_Users.class, userId).getReturnObject();
				u.setUpdatedOn(getCurrentTimeStamp());

				Entity_Users user = (Entity_Users) getOneEntityByField(Entity_Users.class, "username", userName);

				if (u != null && user != null) {
					Long id = user.getUserId();
					if (!userId.equals(id))
						return new GenericResponse(99, "username already taken by another user.", null);
				}
			} else {

				if (getOneEntityByField(Entity_Users.class, "username", userName) != null)
					return new GenericResponse(99, "username already taken by another user.", null);

				u = new Entity_Users();
				u.setCreatedOn(getCurrentTimeStamp());
				newUser = true;
			}

			if (userName.indexOf("@ug.nationmedia.com") == -1)
				userName = userName + "@ug.nationmedia.com";

			u.setUsername(userName.toLowerCase());
			u.setFirstName(o.getString("firstName").toLowerCase());
			u.setLastName(o.getString("lastName").toLowerCase());
			u.setRoleId(ob.getLong("roleId"));
			u.setRole(ob.getString("roleName").toLowerCase());
			u.setEditorOfCategory(sCategoryId);
			u.setStatus(false);
			if (!saveEntity(u))
				throw new DauCentralException("Failed to save user");
			ul.add(u);

			if (newUser)
				sendEmailNotification(userName,
						"Congulations!! You have been added on to the E-Editorial system of Daily Monitor. Welcome to new and convinient platform of processing nes stories",
						"E-EDITORIAL NEW USER ADDED NOTIFICATION");
			return new GenericResponse(0, "user added sucessgully", ul);

		} catch (Exception e) {
			e.printStackTrace();
			return new GenericResponse(99, "Failed to save user", null);
		}
	}

	private GenericResponse getUserByUserName(JSONObject o) {
		String username = o.getString("username");
		List<Entity_Users> uList = null;
		try {
			if (username == "")
				throw new DauCentralException("cant add fellow user without username");
			uList = (List<Entity_Users>) getEntityList(
					"From Entity_Users where username='" + username + "' and status =" + true + "").getReturnObject();

			if (uList == null)
				throw new DauCentralException("Errors occured while adding fellow users");

			if (uList.size() <= 0)
				throw new DauCentralException("user with username not found. Check entered username and try again");
			return new GenericResponse(0, "users", uList.get(0));

		} catch (Exception e) {
			e.printStackTrace();
			return new GenericResponse(99, "Errors occured while fetching users", null);
		}
	}

	private GenericResponse getUsersByRole(JSONObject o) {
		String userRole = o.getString("userRole");
		List<Entity_Users> usersList = new ArrayList<Entity_Users>();
		try {
			if (userRole == "")
				throw new DauCentralException("Role not specified");
			usersList = (List<Entity_Users>) getEntityList("From Entity_Users where role='" + userRole + "'")
					.getReturnObject();

			if (usersList.size() > 0)
				return new GenericResponse(0, "user of role " + userRole, usersList);

			return new GenericResponse(0, "no user found with such a role " + userRole, usersList);
		} catch (DauCentralException e) {
			e.printStackTrace();
			return new GenericResponse(99, "failed to save user role", null);
		}
	}

	private GenericResponse saveUserRoles(JSONObject o) {

		Entity_Roles role = null;
		List<Entity_Roles> roleListSaved = new ArrayList<Entity_Roles>();

		JSONObject roleObj = o.getJSONObject("role");

		Long roleId = o.getLong("roleId");

		String roleName = roleObj.getString("roleName");
		try {
			if (roleObj.getString("roleName") == "")
				throw new DauCentralException("Can't add role without a name.");

			if (roleId != null) {
				role = (Entity_Roles) getEntityById(Entity_Roles.class, roleId).getReturnObject();

				Entity_Roles r = (Entity_Roles) getOneEntityByField(Entity_Roles.class, "roleName", roleName);

				if (r != null && role != null) {
					if (!r.getRoleId().equals(role.getRoleId()))
						throw new DauCentralException("role with such a name already exists.");
				}
			} else {
				if (getOneEntityByField(Entity_Roles.class, "roleName", roleName) != null) {
					throw new DauCentralException("role with such a name already exists.");
				} else {
					role = new Entity_Roles();
				}
			}
			role.setRoleId(o.getLong("roleId"));
			role.setRoleName(roleName);
			role.setDescription(o.getString("description"));

			if (saveEntity(role)) {

				List<Entity_Permissions> pList = addUserPermissions(o.getJSONArray("rolePermissions"), role.getRoleId(),
						roleName);
				Set<Entity_Permissions> set = new HashSet<Entity_Permissions>(pList);
				role.setPermissionsList(set);
				roleListSaved.add(role);
			}
			return new GenericResponse(0, "role added successfuly", roleListSaved);

		} catch (DauCentralException e) {
			e.printStackTrace();
			return new GenericResponse(99, "failed to save user role", null);
		}
	}

	private List<Entity_Permissions> addUserPermissions(JSONArray rolePermissions, Long roleId, String roleName) {

		Entity_Permissions perm = null;
		List<Entity_Permissions> permListSaved = new ArrayList<Entity_Permissions>();

		try {
			for (Object rolePerm : rolePermissions) {

				JSONObject ob = new JSONObject();
				ob = (JSONObject) rolePerm;

				Long permissionId = ob.getLong("id");
				String permissionName = ob.getString("permissionName");

				if (permissionName == "")
					throw new DauCentralException("Can't add permission without a name.");

				if (permissionId != null) {
					perm = (Entity_Permissions) getEntityById(Entity_Permissions.class, permissionId).getReturnObject();

					Entity_Permissions p = (Entity_Permissions) getOneEntityByField(Entity_Permissions.class,
							"permissionName", permissionName);

					if (p != null) {
						if (p.getRoleId() != perm.getRoleId())
							throw new DauCentralException("permission with such a name already exists.");
					}
				} else {

					if (getOneEntityByField(Entity_Permissions.class, "permissionName", permissionName) != null) {
						throw new DauCentralException("permission with such a name already exists.");

					} else {
						perm = new Entity_Permissions();
					}
				}
				perm.setRoleId(roleId);
				perm.setRole(roleName);
				perm.setPermissionName(permissionName);

				if (!saveEntity(perm))
					throw new DauCentralException("failed to save user permission");

				permListSaved.add(perm);
			}
			return permListSaved;

		} catch (DauCentralException e) {
			e.printStackTrace();
			return null;
		}
	}

	private GenericResponse getUserRoles() {
		List<Entity_Roles> rolesList = null;

		List<Entity_Roles> rolesListToReturn = new ArrayList<Entity_Roles>();
		Object obj = new Object();
		try {
			obj = getEntityList("From Entity_Roles").getReturnObject();
			List<Entity_Roles> list = new ArrayList<Entity_Roles>();
			// list = Arrays.asList((Entity_Roles<>)getEntityList("From
			// Entity_Roles").getReturnObject());

			if (obj.getClass().isArray()) {
				list = Arrays.asList((Entity_Roles[]) obj);
			} else if (obj instanceof Collection) {
				list = new ArrayList<>((Collection<Entity_Roles>) obj);
			}

			if (list == null || list.size() <= 0)
				throw new DauCentralException("No user roles found");

			for (Entity_Roles r : list) {
				Set<Entity_Permissions> set = new HashSet<Entity_Permissions>(getRolePermission(r.getRoleId()));

				r.setPermissionsList(set);
				rolesListToReturn.add(r);
			}

			return new GenericResponse(0, "roles", rolesListToReturn);

		} catch (DauCentralException e) {
			e.printStackTrace();
			return new GenericResponse(99, "Errors occured while fetching user roles", null);
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

	private GenericResponse deleteRolePermissions(JSONObject ob) {
		Long permissionId = ob.getLong("permissionId");
		Entity_Permissions p = (Entity_Permissions) getEntityById(Entity_Permissions.class, permissionId)
				.getReturnObject();

		if (p != null)
			if (deleteEntity(p)) {
				return new GenericResponse(0, "Permission deleted succefully", p.getPermissionName());
			} else {
				return new GenericResponse(99, "Failed to delete permission", null);
			}
		return null;
	}

	private GenericResponse getAllUser() {
		List<Entity_Users> usersList = new ArrayList<Entity_Users>();
		List<Entity_Users> usersListToReturn = new ArrayList<Entity_Users>();
		try {
			usersList = (List<Entity_Users>) getEntityList("From Entity_Users").getReturnObject();
			if (usersList.size() > 0) {
				for (Entity_Users u : usersList) {
					u.setUserRole(getUserRole(u.getRoleId()));
					if (u.getEditorOfCategory() != null) {
						u.setEditorOfCategoryEntity(getStoryCategoryById(u.getEditorOfCategory()));
					}
					usersListToReturn.add(u);
				}

				return new GenericResponse(0, "users", usersListToReturn);
			} else {
				return new GenericResponse(0, "No user found with such a value", null);
			}
		} catch (Exception e) {
			e.printStackTrace();
			return new GenericResponse(99, "Errors occured while fetching users", null);
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

	private GenericResponse getUserByAnyFeild(JSONObject o) {
		String searchValue = o.getString("searchValue");
		List<Entity_Users> usersList = new ArrayList<Entity_Users>();
		List<Entity_Users> usersListToReturn = new ArrayList<Entity_Users>();
		try {
			if (searchValue == "")
				throw new DauCentralException("Empty value not allowed, Enter search value please");
			usersList = (List<Entity_Users>) getEntityList("From Entity_Users username='" + searchValue
					+ "' or lastName='" + searchValue + "' of firstName='" + searchValue + "'").getReturnObject();

			if (usersList.size() > 0) {
				for (Entity_Users u : usersList) {
					u.setUserRole(getUserRole(u.getRoleId()));
					usersListToReturn.add(u);
				}

				return new GenericResponse(0, "users", usersListToReturn);
			} else {
				return new GenericResponse(0, "No user found with such a value", null);
			}
		} catch (Exception e) {
			e.printStackTrace();
			return new GenericResponse(99, "Errors occured while fetching users", null);
		}
	}

	private GenericResponse getUserById(JSONObject o) {
		Entity_Users user = null;
		List<Entity_Users> userList = new ArrayList<Entity_Users>();
		Long userId = o.getLong("userId");
		try {
			if (userId == null)
				throw new DauCentralException("Can't un identified user ");
			user = (Entity_Users) getEntityById(Entity_Users.class, userId).getReturnObject();

			if (user == null)
				throw new DauCentralException("User not found ");
			userList.add(user);
			return new GenericResponse(0, "Users", userList);
		} catch (DauCentralException e) {
			e.printStackTrace();
			return new GenericResponse(0, "Error occured while fetching user", null);
		}
	}

	private Entity_Roles getUserRole(Long roleId) {
		Entity_Roles role = null;
		try {
			if (roleId == null)
				throw new DauCentralException("Can't set un identified role for a user ");
			role = (Entity_Roles) getEntityById(Entity_Roles.class, roleId).getReturnObject();

			return role;
		} catch (DauCentralException e) {
			e.printStackTrace();
			return null;
		}
	}

	private GenericResponse changePassword(JSONObject ob) {
		Long userId = ob.getLong("userId");
		Entity_Users u = null;
		String password = ob.getString("password");

		try {
			if (password == null || password.equals(null))
				return new GenericResponse(99, "Users Password can't be rest to null", null);

			if (userId == null)
				return new GenericResponse(99, "You can't change password for un system user, contact admin for help",
						null);
			u = (Entity_Users) getEntityById(Entity_Users.class, userId).getReturnObject();
			if (u == null)
				throw new DauCentralException("You can't change password for un system user, contact admin for help");
			u.setPassword(password);
			u.setStatus(true);
			if (!saveEntity(u))
				throw new DauCentralException("Failed to password for user");

			sendEmailNotification(u.getUsername(), "Your password was changed", "E-EDITORIAL");

			return new GenericResponse(0, "Password for user" + u.getFirstName()+ " "+u.getLastName()+ " has been changed succefully",
					getAllUser());
		} catch (Exception e) {
			e.printStackTrace();
			return new GenericResponse(99, "Failed to reset password for user", null);
		}
	}

	private GenericResponse userChangeHisOwnPassword(JSONObject ob) {
		Entity_Users u = null;
		Long userId = ob.getLong("userId");
		String currentPassword = ob.getString("currentPassword");
		String newPassword = ob.getString("newPassword");
		List<Entity_Users> usersList = new ArrayList<Entity_Users>();

		try {
			if (currentPassword == null && newPassword.equals(null))
				return new GenericResponse(99, "Users Password can't be rest to null", null);

			if (userId == null)
				return new GenericResponse(99,
						"You can't change password for unknown system user, contact admin for help", null);
			u = (Entity_Users) getEntityById(Entity_Users.class, userId).getReturnObject();

			usersList = (List<Entity_Users>) getEntityList(
					"From Entity_Users where password='" + currentPassword + "' and userId ='" + userId + "'")
							.getReturnObject();
			if (usersList != null) 
				u = usersList.size() > 0 ? usersList.get(0) : null;

				if (u == null)
					return new GenericResponse(99,
							"You can't change password for unknown system user, contact admin for help", null);

				u.setPassword(newPassword);

				if (!saveEntity(u))
					return new GenericResponse(99,"Failed to password for user", null);

				sendEmailNotification(u.getUsername(), "Your password was changed", "E-EDITORIAL");

				return new GenericResponse(0, "Password for" + u.getUsername() + " has been changed succefully", null);
			
		} catch (Exception e) {
			e.printStackTrace();
			return new GenericResponse(99, "Failed to reset password for user", null);
		}
	}

	private GenericResponse changeUserActivityStatus(JSONObject ob) {
		Long userId = ob.getLong("userId");
		Boolean status = ob.getBoolean("status");
		Entity_Users u = null;

		try {
			if (userId == null)
				throw new DauCentralException(
						"You can't change activity status for unknown system user, contact admin for help");
			u = (Entity_Users) getEntityById(Entity_Users.class, userId).getReturnObject();
			if (u == null)
				throw new DauCentralException(
						"You can't change activity status for unknown system user, contact admin for help");
			u.setStatus(status);
			if (!saveEntity(u))
				throw new DauCentralException("Changing user activity status failed");

			return new GenericResponse(0, "User account status change successfully for user " + u.getUsername(),
					getEntityList("From Entity_Users").getReturnObject());

		} catch (Exception e) {
			e.printStackTrace();
			return new GenericResponse(99, "Changing user account status failed", null);
		}
	}

	private GenericResponse changeUserRole(JSONObject ob) {
		Long userId = ob.getLong("userId");
		Long roleId = ob.getLong("roleId");
		Entity_Users u = (Entity_Users) getEntityById(Entity_Users.class, userId).getReturnObject();
		Entity_Roles r = (Entity_Roles) getEntityById(Entity_Roles.class, roleId).getReturnObject();

		try {
			if (r == null)
				throw new DauCentralException("You can't assign user unkonwn system role, contact admin for help");

			if (u == null)
				throw new DauCentralException("You can't assign role to un system user, contact admin for help");
			u.setRoleId(roleId);
			u.setRole(ob.getString("roleName"));
			if (!saveEntity(u))
				throw new DauCentralException("Failed to change role for user << " + u.getUsername() + " >>");
			return new GenericResponse(0, "Role for user" + u.getUsername() + " has been changed succefully", null);

		} catch (Exception e) {
			e.printStackTrace();
			return new GenericResponse(99, "Failed to change role for user <<  " + u.getUsername() + " >>", null);
		}
	}

}
