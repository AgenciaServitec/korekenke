import ReactGA4 from "react-ga4";

export const useAnalyticsEventTracker = (category = "Web category") => {
  return (action = "test action", label = "test label") => {
    ReactGA4.event({ category, action, label });
  };
};
