package com.monitor.editorial.Core;

import com.sun.mail.smtp.SMTPTransport;

import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.Session;
import javax.mail.internet.MimeMessage;

import java.io.UnsupportedEncodingException;
import java.util.Properties;
import javax.mail.*;  
import javax.mail.internet.*;  


public class EmailsNoficationCore {
	
	public void sendEmailNotification(String recepientEmail, String messageBody, String subject) throws UnsupportedEncodingException {
		 String host="ugwebmail.ug.nationmedia.com";  
		  final String user="dmpalampa@ug.nationmedia.com";//change accordingly  
		  final String password="*David123";//change accordingly  
		  String to="";
		  
		   //Get the session object  
		   Properties props = new Properties();  
		   props.put("mail.smtp.host",host);  
		   props.put("mail.smtp.auth", "true");  
		     
		   Session session = Session.getDefaultInstance(props,  
		    new javax.mail.Authenticator() {  
		      protected PasswordAuthentication getPasswordAuthentication() {  
		    return new PasswordAuthentication(user,password);  
		      }  
		    });  
		  
		   //Compose the message  
		    try {  
		     MimeMessage message = new MimeMessage(session);  
		     message.setFrom(new InternetAddress(user, "E-EDITORIAL"));  
		     message.addRecipient(Message.RecipientType.TO,new InternetAddress(recepientEmail));  
		     message.setSubject(subject);  
		     message.setText(messageBody);  
		       
		    //send the message  
		     Transport.send(message);  
		  
		     System.out.println("message sent successfully...");  
		   
		     } catch (MessagingException e) {e.printStackTrace();}  
		 }  
		}  

