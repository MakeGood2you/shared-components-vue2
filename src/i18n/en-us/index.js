export default {
  InputRecordName:'kobikbo',
  backOffice: {
    header: 'Back Office',

    labels: {
      name: 'Name',
      icon_url: 'Icon url',
      anchor: 'Anchor (12,36)',
      mapping: 'Mapping',

      filters: 'Filters',
      orderId: 'Order ID',
      trackingId: 'Tracking ID',
      postCode: 'Postcode',
      sku: 'SKU',
      search: 'Search',

      status: 'Status',
      pending: 'Pending',
      approved: 'Approved',
      rejected: 'Rejected',

      code: 'Code',
      yes: 'Yes',
      no: 'No',
      description: 'Description',
      label: 'Label',
      sortOrder: 'Sort order',


      data: 'data',
      close: 'Close',
      save: 'Save',
      cancel: 'Cancel',
      show: 'SHOW',
      clear: 'CLEAR',

      carrier: 'Carrier',
      returnReason: 'Return Reason',
      returnType: 'Return Type',
      returnedItems: 'Returned Items',

      groupBy: 'Group By',
      bucketBy: 'Bucket By',
      countOf: 'Count Of',

      items: 'Items',
      orders: 'Orders',

      fromDate: 'From Date',
      toDate: 'To Date',
      date: 'Date',
      hour: 'Hour',
      hourDay: 'Hourday',
      day: 'Day',
      week: 'Week',
      dayOfWeek: 'Day Of Week',
      month: 'Month',
    },

    errors: {
      enterCurrentPassword: 'Please enter your current password',
      enterNewPassword: 'Please enter your new password',
      noEmailData: 'Please enter your email address',
      noPasswordData: 'Please enter your password',
      notValidPasswordLength: 'Password must be at least 6 characters.',
      notValidEmail: 'Invalid email address.',
    },

    messages: {
      selectLeastOfOne: 'You must select at least one of the following options:',
      emailHasBeenSent: 'An email has been sent to {email} with instructions to reset your password.',
      NoDataAvailable: 'No data available',
    },

    login: {
      title: 'Login',
      forgotPassword: 'Forgot password?',
      buttonDataLabel: 'LOGIN',
    },

    forgotPassword: {
      rememberPassword: 'Remember the password?',
      buttonDataLabel: 'SEND',
      title: 'Forgot password',
      description: 'Enter the email address associated with your account and we will send you a link to reset your password.',
    },

    resetPassword: {
      title: 'Reset Password',
      buttonDataLabel: 'Reset your password',
    },

    dashBoard: {
      customerCare: 'Customer Care',
      inspections: 'Inspections',
      statistics: 'Statistics',
      users: 'Users',
      settings: 'Settings',
      changePassword: 'Change Password',
      logOut: 'Logout',
    },

    changePassword: {
      currentPassword: 'Current Password',
      newPassword: ' New Password',
      repeatPassword: 'Repeat Password',
      title: 'Change Password',
      save: 'SAVE',
    },

    inspectionsTab: {
      returnApproved: 'Return approved',
      returnPending: 'Return is now Pending',
      returnRejected: 'Return rejected',
    },

    returnTab: {
      authorizer: 'Authorizer',
      refund: 'Refund',
      exchange: 'Exchange',
    },

    statsTab: {
      title: 'Statistics',
      table: 'Table',
      graph: 'Graph',
      showLayer: 'Show layer',
      selectLeastOfOneOptions: 'group by, bucket by',
    },

    usersTab: {
      title: 'Users',
      firstName: 'First Name',
      lastName: 'Last Name',
      email: 'E-mail',
      role: 'Role',
      deleteUserMessage: 'Are you sure you want to delete this user?',

    },
    returnReasonsTab: {
      title: 'Return Reasons',
      otailoCategory: 'Otailo category',
      isVisible: 'Is visible',
      addReason: 'ADD REASON',
      otailoCategoryOptions: [
        {
          label: 'Customer Remorse',
          value: 'CustomerRemorse'
        },
        {
          label: 'Bracketing',
          value: 'Bracketing'
        },
        {
          label: 'Fraudulent Behavior',
          value: 'FraudulentBehavior'
        },
        {
          label: 'Product Variant Mismatch',
          value: 'ProductVariantMismatch'
        },
        {
          label: 'Product Expectations Unmet',
          value: 'ProductExpectationsUnmet'
        },
        {
          label: 'Faulty Product',
          value: 'FaultyProduct'
        },
        {
          label: 'Incorrectly Advertised',
          value: 'IncorrectlyAdvertised'
        },
        {
          label: 'Fulfillment Error',
          value: 'FulfillmentError'
        },
        {
          label: 'Damaged Shipment',
          value: 'DamagedShipment'
        },
        {
          label: 'Late Shipment',
          value: 'LateShipment'
        },
        {
          label: 'Other',
          value: 'Other'
        }
      ],
      addNewFaulty: 'Add New Faulty'
    },
    geographicLayersTab: {
      title: 'Geographic Layers',
      addLayer: 'Add layer',
      deleteConfirmMessage: 'Are you sure you want to delete this layer?',
      updatePoi: 'Poi was uploaded successfully'
    }
  },
}
