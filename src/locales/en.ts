export default {
  translation: {
    appName: 'Task Manager',
    flash: {
      login: {
        success: 'You are logged in',
        errors: {
          email: 'User with this email not found',
          password: 'Incorrect password',
        },
      },
      logout: {
        success: 'You are logged out',
        error: 'Logout error',
      },
      users: {
        create: {
          success: 'User registered successfully',
          error: 'Failed to register',
        },
        edit: {
          success: 'User edited successfully',
          error: 'Failed to edit',
          reject: 'You cannot edit another user',
        },
        delete: {
          success: 'User deleted successfully',
          error: 'Failed to delete',
          reject: 'You cannot delete another user',
        },
      },
      statuses: {
        create: {
          success: 'Status successfully created',
          error: 'Failed to create status',
        },
        edit: {
          success: 'Status successfully changed',
          error: 'Failed to change status',
        },
        delete: {
          success: 'Status successfully deleted',
          error: 'Failed to delete status',
        },
      },
      labels: {
        create: {
          success: 'Label successfully created',
          error: 'Failed to create label',
        },
        edit: {
          success: 'Label successfully changed',
          error: 'Failed to change label',
        },
        delete: {
          success: 'Label successfully deleted',
          error: 'Failed to delete label',
        },
      },
      tasks: {
        create: {
          success: 'Task successfully created',
          error: 'Failed to create task',
        },
        edit: {
          success: 'Task successfully changed',
          error: 'Failed to change task',
        },
        delete: {
          success: 'Task successfully deleted',
          error: 'Failed to delete task',
          forbidden: 'Task can be deleted only by its author',
        },
      },
    },
    navbar: {
      users: 'Users',
      statuses: 'Statuses',
      labels: 'Labels',
      tasks: 'Tasks',
      login: 'Login',
      signUp: 'Sign-up',
      logout: 'Logout',
    },
    titles: {
      users: 'Users',
      statuses: 'Statuses',
      labels: 'Labels',
      tasks: 'Tasks',
      createStatus: 'Status creation',
      createLabel: 'Label creation',
      createTask: 'Task creation',
      editUser: 'Edit user',
      editStatus: 'Edit status',
      editLabel: 'Edit label',
      editTask: 'Edit task',
      signUp: 'Sign-up',
      login: 'Login',
    },
    tableCols: {
      id: 'ID',
      fullName: 'Full name',
      email: 'Email',
      name: 'Name',
      status: 'Status',
      creator: 'Author',
      executor: 'Executor',
      createdAt: 'Created at',
      actions: 'Actions',
    },
    buttons: {
      edit: 'Edit',
      delete: 'Delete',
      send: 'Send',
      sending: 'Sending...',
      cancel: 'Cancel',
      createStatus: 'Create status',
      createLabel: 'Create label',
      createTask: 'Create task',
      show: 'Show',
      reset: 'Reset',
      changePassword: 'Change password',
    },
    form: {
      inputs: {
        firstName: 'First Name',
        lastName: 'Last Name',
        email: 'Email',
        password: 'Password',
        currentPassword: 'Current Password',
        newPassword: 'New Password',
        confirmPassword: 'Confirm Password',
        name: 'Name',
      },
      textarea: {
        description: 'Description',
      },
      selects: {
        status: 'Status',
        executor: 'Executor',
        label: 'Label',
        labels: 'Labels',
        defaults: {
          status: '-- Select status --',
          executor: '-- Select executor --',
          label: '-- Select label --',
        },
      },
      checkboxes: {
        isCreator: 'My tasks only',
      },
      errors: {
        min_one: 'Must be at least {{count}} character',
        min_other: 'Must be at least {{count}} characters',
        email: {
          invalid: 'Invalid email',
          exists: 'Email is already exists',
        },
        name: {
          exists: 'Name already in use',
        },
        required: 'Required field',
        password: {
          mismatch: 'Passwords do not match',
          invalid: 'Invalid password',
        },
      },
    },
    errors: {
      server: 'Internal server error',
      forbidden: 'Access denied',
    },
  },
};
