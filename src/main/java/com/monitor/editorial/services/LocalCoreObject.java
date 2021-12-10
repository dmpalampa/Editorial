package com.monitor.editorial.services;

import java.security.SecureRandom;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import java.util.Random;
import java.util.*;

import org.hibernate.Criteria;
import org.hibernate.HibernateException;
import org.hibernate.Query;
import org.hibernate.Session;
import org.hibernate.Transaction;
import org.hibernate.criterion.Criterion;
import org.hibernate.criterion.Order;
import org.hibernate.criterion.Restrictions;
import org.mindrot.jbcrypt.BCrypt;

import com.monitor.editorial.Core.EmailsNoficationCore;

public class LocalCoreObject extends EmailsNoficationCore {

	public boolean saveEntity(Object entity) {
		// Update
		Session session = SessionUtil.getSession();
		Transaction transaction = null;
		try {
			transaction = session.beginTransaction();
			session.saveOrUpdate(entity);
			transaction.commit();
			return true;

		} catch (Exception e) {
			if (transaction != null)
				transaction.rollback();
			e.printStackTrace();
			return false;
		} finally {
			session.close();
		}
	}

	public OperationReturnObject getEntityList(String hql) {
		Session session = SessionUtil.getSession();
		OperationReturnObject operationReturnObject = new OperationReturnObject();
		try {
			Query query = session.createQuery(hql);
			List results = query.list();
			operationReturnObject.setCodeAndMessage(0, "List obtained");
			operationReturnObject.setReturnObject(results);
			return operationReturnObject;
		} catch (HibernateException e) {
			e.printStackTrace();
			operationReturnObject.setCodeAndMessage(700, "An error occured while retrieving entity from storage");
			return operationReturnObject;
		} finally {
			session.close();
		}
	}
	

	public Long getEntityCount(String hql) {
		Session session = SessionUtil.getSession();
		try {
			Query query = session.createQuery(hql);
			Long count = (Long) query.uniqueResult();
			return count;
		} catch (HibernateException e) {
			e.printStackTrace();
			return null;
		} finally {
			session.close();
		}
	}
	

	public <T> List<T> getEntityListWithOrder(Class<T> T, String field, Object value, String orderByField) {
		Session session = SessionUtil.getSession();
		try {
			Criteria criteria = session.createCriteria(T);
			criteria.add(Restrictions.eq(field, value));
			criteria.addOrder(Order.desc(orderByField));
			return (List<T>) criteria.list();
		} catch (Exception e) {
			e.printStackTrace();
			return new ArrayList<T>();
		} finally {
			session.close();
		}
	}

	public boolean saveEntities(Object... entities) {
		// Update
		Session session = SessionUtil.getSession();
		Transaction transaction = null;
		try {
			transaction = session.beginTransaction();
			for (Object entity : entities) {
				session.saveOrUpdate(entity);
			}
			transaction.commit();
			return true;

		} catch (Exception e) {
			if (transaction != null)
				transaction.rollback();
			e.printStackTrace();
			return false;
		} finally {
			session.close();
		}
	}

	public boolean deleteEntity(Object entity) {
		Session session = SessionUtil.getSession();
		Transaction transaction = null;
		try {
			transaction = session.beginTransaction();
			session.delete(entity);
			transaction.commit();
			return true;

		} catch (Exception e) {
			if (transaction != null)
				transaction.rollback();
			e.printStackTrace();
			return false;
		} finally {
			session.close();
		}
	}

	public OperationReturnObject getEntityById(Class entityClass, Long id) {
		Session session = SessionUtil.getSession();
		OperationReturnObject operationReturnObject = new OperationReturnObject();
		try {
			Object o = session.get(entityClass, id);
			operationReturnObject.setCodeAndMessage(0, "Entity obtained");
			if (o == null) {
				operationReturnObject.setCodeAndMessage(404, "Entity not found");
			}
			operationReturnObject.setReturnObject(o);
			return operationReturnObject;
		} catch (HibernateException e) {
			e.printStackTrace();
			operationReturnObject.setCodeAndMessage(700, "An error occured while retrieving entity from storage");
			return operationReturnObject;
		} finally {
			session.close();
		}
	}

	public <T> T getOneEntityByField(Class<T> T, String field, Object value) {
		Session session = SessionUtil.getSession();
		try {
			Criteria criteria = session.createCriteria(T);
			criteria.add(Restrictions.eq(field, value));
			criteria.setMaxResults(1);
			List<T> list = criteria.list();
			return list.size() == 0 ? null : list.get(0);
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		} finally {
			session.close();
		}
	}

	public <T> List<T> getManyEntitiesByField(Class<T> T, String field, Object value) {
		Session session = SessionUtil.getSession();
		try {
			Criteria criteria = session.createCriteria(T);
			criteria.add(Restrictions.eq(field, value));
			// criteria.setMaxResults(1);
			return (List<T>) criteria.list();
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		} finally {
			session.close();
		}
	}
	
	public <T> List<T> getManyEntitiesByFieldWithOrder(Class<T> T, String field, Object value, String fieldOrder) {
		Session session = SessionUtil.getSession();
		try {
			Criteria criteria = session.createCriteria(T);
			criteria.add(Restrictions.eq(field, value));
			criteria.addOrder(Order.desc(fieldOrder));
			// criteria.setMaxResults(1);
			return (List<T>) criteria.list();
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		} finally {
			session.close();
		}
	}

	private <T> List<T> getListNoCriteriasWithOrder(Class<T> T, String field) {
		Session session = SessionUtil.getSession();
		try {
			Criteria criteria = session.createCriteria(T);
			criteria.addOrder(Order.desc(field));
			return (List<T>) criteria.list();
		} catch (Exception e) {
			e.printStackTrace();
			return new ArrayList<T>();
		} finally {
			session.close();
		}
	}

	public <T> T getOneByCriterias(Class<T> T, Criteria criteria) {
		Session session = SessionUtil.getSession();
		try {
			// Criteria criteria_ = session.createCriteria(T);
			/*
			 * for (Criterion criterion : criteria) { criteria.add(criterion); }
			 */
			criteria.setMaxResults(1);
			List<T> list = criteria.list();
			return list.size() == 0 ? null : list.get(0);
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		} finally {
			session.close();
		}
	}

	protected static String getSaltString() {
		String SALTCHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
		StringBuilder salt = new StringBuilder();
		Random rnd = new Random();
		while (salt.length() < 18) { // length of the random string.
			int index = (int) (rnd.nextFloat() * SALTCHARS.length());
			salt.append(SALTCHARS.charAt(index));
		}
		String saltStr = salt.toString();
		return saltStr;
	}

	// creating authentication token
	private static final SecureRandom secureRandom = new SecureRandom(); // threadsafe
	private static final Base64.Encoder base64Encoder = Base64.getUrlEncoder(); // threadsafe

	public static String generateNewToken() {
		byte[] randomBytes = new byte[24];
		secureRandom.nextBytes(randomBytes);
		return base64Encoder.encodeToString(randomBytes);
	}

	public Timestamp getCurrentTimeStamp() {
		return new Timestamp(new Date().getTime());
	}

	public long getCurrentTimeStampDay() {
		long timestamp = new Date().getTime();
		Calendar cal = Calendar.getInstance();
		cal.setTimeInMillis(timestamp);
		return cal.get(Calendar.DATE);
	}

	/**
	 * hash password
	 * 
	 * @param password_plaintext
	 * @return
	 */
	public static String bCryptEncryption(String password_plaintext) {
		String salt = BCrypt.gensalt(14);
		String hashed_password = null;
		try {
			hashed_password = BCrypt.hashpw(password_plaintext, salt);

			return (hashed_password);

		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}

	}

	/**
	 * verify hashed passsword
	 * 
	 * @param password_plaintext
	 * @param stored_hash
	 * @return
	 */
	public static boolean isValidPassword(String password_plaintext, String stored_hash) {
		boolean password_verified = false;
		

		try {
			if (null == stored_hash || !stored_hash.startsWith("$2a$"))
				throw new IllegalArgumentException("Invalid hash provided for comparison");

			password_verified = BCrypt.checkpw(password_plaintext, stored_hash);
		} catch (Exception e) {
			e.printStackTrace();
		}

		return (password_verified);
	}

}
