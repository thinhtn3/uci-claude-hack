const supabase = require('../models/supabase');

const authService = {
  // Register new user
  async register(email, password, name) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name }
      }
    });

    if (error) throw new Error(error.message);
    return data;
  },

  // Login user
  async login(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw new Error(error.message);
    return data;
  },

  // Sign out user
  async signOut(accessToken) {
    const { error } = await supabase.auth.signOut(accessToken);
    if (error) throw new Error(error.message);
    return { success: true };
  },

  // Verify user is logged in
  async verifyUser(accessToken) {
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    if (error) throw new Error(error.message);
    if (!user) throw new Error('User not found');
    return user;
  }
};

module.exports = authService;
