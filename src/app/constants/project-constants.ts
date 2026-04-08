export const projectConstantsLocal = {
  ACCOUNTS_STATUS: [
    { id: 0, name: 'all', displayName: 'All Accounts' },
    { id: 1, name: 'Active', displayName: 'Active Accounts' },
    { id: 2, name: 'In Active', displayName: 'In Active Accounts' },
  ],
  // ✅ ADD THESE TWO:
  REMARK_STATUS: [
    { id: '1', name: 'account',      displayName: 'Account Remark'    },
    { id: '2', name: 'contact', displayName: 'Contact Remark'   },
    { id: '3', name: 'socialmedia',      displayName: 'Social Media Remark'    }
  ],

  REMARKS_STATUS: [
    { id: 0, name: 'all',      displayName: 'All'      },
    { id: 1, name: 'active',   displayName: 'Active'   },
    { id: 2, name: 'inactive', displayName: 'Inactive' },
  ],
  // BASE_URL: 'http://localhost:5002/',

  // BASE_URL: 'https://rest.thefintalk.in:5002/',
  BASE_URL :'https://api.myloancrm.com/app/',
  VERSION_DESKTOP: '0.0.0',
};
