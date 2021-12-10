package com.monitor.editorial.entities;

import javax.persistence.*;
import java.sql.Date;

@Entity
@Table(name = "permissons", schema = "public", catalog = "postgres")
public class Entity_Permissions {

    private Long id;
    private Long roleId;
    private String role;
    private String permissionName;
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public Long getRoleId() {
		return roleId;
	}
	public void setRoleId(Long roleId) {
		this.roleId = roleId;
	}
	public String getRole() {
		return role;
	}
	public void setRole(String role) {
		this.role = role;
	}
	public String getPermissionName() {
		return permissionName;
	}
	public void setPermissionName(String permissionName) {
		this.permissionName = permissionName;
	}
   
	 @Override
	    public boolean equals(Object o) {
	        if (this == o) return true;
	        if (o == null || getClass() != o.getClass()) return false;

	        Entity_Permissions that = (Entity_Permissions) o;

	        if (id != null ? !id.equals(that.id) : that.id != null) return false;
	        if (roleId != null ? !roleId.equals(that.roleId) : that.roleId != null) return false;
	        if (role != null ? !role.equals(that.role) : that.role != null) return false;
	        if (permissionName != null ? !permissionName.equals(that.permissionName) : that.permissionName != null) return false;
	    
	        return true;
	    }

	    @Override
	    public int hashCode() {
	        int result = id != null ? id.hashCode() : 0;
	        result = 31 * result + (roleId != null ? roleId.hashCode() : 0);
	        result = 31 * result + (role != null ? role.hashCode() : 0);
	        result = 31 * result + (permissionName != null ? permissionName.hashCode() : 0);

	        return result;
	    }
   
}
