package com.monitor.editorial.entities;

import java.util.Set;

import javax.persistence.*;

@Entity
@Table(name = "roles", schema = "public", catalog = "postgres")
public class Entity_Roles {
    private Long roleId;
    private String refNumber;
    private String roleName;
    private String description;
    private Set<Entity_Permissions> permissionsList;

    @Id
    @Column(name = "role_id", nullable = false)
    public Long getRoleId() {
        return roleId;
    }

    public void setRoleId(Long roleId) {
        this.roleId = roleId;
    }

    @Basic
    @Column(name = "ref_number", nullable = true, length = -1)
    public String getRefNumber() {
        return refNumber;
    }

    public void setRefNumber(String refNumber) {
        this.refNumber = refNumber;
    }

    @Basic
    @Column(name = "role_name", nullable = true, length = -1)
    public String getRoleName() {
        return roleName;
    }

    public void setRoleName(String roleName) {
        this.roleName = roleName;
    }

    @Basic
    @Column(name = "description", nullable = true, length = -1)
    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    @OneToMany(mappedBy="permissions")
    public Set<Entity_Permissions> getPermissionsList() {
		return permissionsList;
	}

	public void setPermissionsList(Set<Entity_Permissions> permissionsList) {
		this.permissionsList = permissionsList;
	}
    
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        Entity_Roles that = (Entity_Roles) o;

        if (roleId != null ? !roleId.equals(that.roleId) : that.roleId != null) return false;
        if (refNumber != null ? !refNumber.equals(that.refNumber) : that.refNumber != null) return false;
        if (roleName != null ? !roleName.equals(that.roleName) : that.roleName != null) return false;
        if (description != null ? !description.equals(that.description) : that.description != null) return false;
        if (permissionsList != null ? !permissionsList.equals(that.permissionsList) : that.permissionsList != null) return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = roleId != null ? roleId.hashCode() : 0;
        result = 31 * result + (refNumber != null ? refNumber.hashCode() : 0);
        result = 31 * result + (roleName != null ? roleName.hashCode() : 0);
        result = 31 * result + (description != null ? description.hashCode() : 0);
        result = 31 * result + (permissionsList != null ? permissionsList.hashCode() : 0);
        return result;
    }

	
}
