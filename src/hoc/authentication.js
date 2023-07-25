import locationHelperBuilder from "redux-auth-wrapper/history4/locationHelper";
import { connectedRouterRedirect } from "redux-auth-wrapper/history4/redirect";

const locationHelper = locationHelperBuilder({});

export const userIsAuthenticatedAsAAdmin = connectedRouterRedirect({
    authenticatedSelector: state => state.user.isLoggedIn && state.user.userInfo.roleId === "R1",
    wrapperDisplayName: 'userIsAuthenticatedAsAAdmin',
    redirectPath: state => state.user.isLoggedIn && state.user.userInfo.roleId === "R2" ? '/doctor' : '/login'
});

export const userIsAuthenticatedAsADoctor = connectedRouterRedirect({
    authenticatedSelector: state => state.user.isLoggedIn,
    wrapperDisplayName: 'userIsAuthenticatedAsADoctor',
    redirectPath: '/login'
});

export const userIsNotAuthenticated = connectedRouterRedirect({
    // Want to redirect the user when they are authenticated
    authenticatedSelector: state => !state.user.isLoggedIn,
    wrapperDisplayName: 'UserIsNotAuthenticated',
    redirectPath: (state, ownProps) => locationHelper.getRedirectQueryParam(ownProps) || '/',
    allowRedirectBack: false
});