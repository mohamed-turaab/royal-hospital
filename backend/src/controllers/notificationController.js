import Notification from "../models/Notification.js";
import User from "../models/User.js";

/**
 * Helper: create a notification for one or more users by role or by userId array
 * Called internally by other controllers.
 */
export async function createNotification({ recipientIds = [], roles = [], title, body, type = "info", link = "" }) {
  try {
    let targets = [...recipientIds];

    // If roles are provided, find all users with those roles
    if (roles.length > 0) {
      const users = await User.find({ role: { $in: roles } }).select("_id");
      targets = [...targets, ...users.map(u => u._id)];
    }

    // Remove duplicates
    const unique = [...new Set(targets.map(String))];

    if (unique.length === 0) return;

    const docs = unique.map(recipientId => ({
      recipient: recipientId,
      title,
      body,
      type,
      link,
      read: false,
    }));

    await Notification.insertMany(docs);
  } catch (err) {
    console.error("createNotification error:", err);
  }
}

/**
 * GET /api/notifications
 * Returns all notifications for the logged-in user (unread first).
 */
export async function getMyNotifications(req, res) {
  try {
    const notifications = await Notification.find({ recipient: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(notifications);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

/**
 * PATCH /api/notifications/:id/read
 * Mark a single notification as read.
 */
export async function markAsRead(req, res) {
  try {
    await Notification.findOneAndUpdate(
      { _id: req.params.id, recipient: req.user._id },
      { read: true }
    );
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

/**
 * PATCH /api/notifications/read-all
 * Mark all notifications for logged-in user as read.
 */
export async function markAllAsRead(req, res) {
  try {
    await Notification.updateMany({ recipient: req.user._id, read: false }, { read: true });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

/**
 * DELETE /api/notifications/clear
 * Delete all notifications for logged-in user.
 */
export async function clearAllNotifications(req, res) {
  try {
    await Notification.deleteMany({ recipient: req.user._id });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}
