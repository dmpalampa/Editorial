package com.monitor.editorial.services;



public class OperationReturnObject extends ReturnObject
{
    private Object ReturnObject;

    public OperationReturnObject() {

    }
    //constructor that sets it from a bare operation return
    public OperationReturnObject(ReturnObject o) {
        if(o!=null) {
        setCodeAndMessage(o.getReturnCode(), o.getReturnMessage());
        }
    }

    public Object getReturnObject()
    {
        return ReturnObject;
    }

    public void setReturnObject(Object returnObject)
    {
        ReturnObject = returnObject;
    }
}
