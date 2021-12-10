package com.monitor.editorial.Core;

public class ReturnObject {

    private String ReturnMessage;
    private Integer ReturnCode;
    
    public String getReturnMessage() {
        return ReturnMessage;
    }

    public Integer getReturnCode() {
        return ReturnCode;
    }
 
    public void setCodeAndMessage(Integer ReturnCode,String ReturnMessage) {
    	this.ReturnMessage = ReturnMessage;
        this.ReturnCode = ReturnCode;	
    }
	
}
