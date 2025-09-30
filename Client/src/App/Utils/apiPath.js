// User Auth
export const USER_LOGIN = "Account/Login";
export const USER_LOGOUT = "Account/Logout";
export const ADD_USER = "Account/Register";
export const SERVER_STATUS_CHECK = "Account/ServerStatusCheck";

//Dashboard
export const DAILY_REPORT_DATA = "DashBoard/GetDashBoardData";
export const DAILY_REPORT_ALL_VIEWS_DATA = "DashBoard/GetAllMediaCountView"

//Submission View
export const SUBMISSION_VIEW_DATES = "DropDown/GetSubmissionDatesDropDown";
// export const SUBMISSION_VIEW_ALL_DATA = "DropDown/GetMediaDropDown";
export const SUBMISSION_VIEW_ALL_DATA =
  "DropDown/GetSubmissionViewMediaDropDownView";
export const GET_STATES_DROPDOWN = "DropDown/GetStateDropDown";
export const GET_REJECTS_REASONS_DROPDOWN = "DropDown/GetRejectReasonsDropDown";

export const DOWNLOAD_TSV_FILE = "SubmissionView/DownloadTSVFile";
export const UPLOAD_FILE = "SubmissionView/UploadCSV";
export const GET_SUBMISSION_VIEW_DATA = "SubmissionView/GetSubmissionCount";
export const GET_MEDIA_DATA = "SubmissionView/GetMediaData";
export const FETCH_DUNCAN_MASTER_RECORD =
  "SubmissionView/FetchDuncanMasterRecord";
export const SUBMIT_DUNCAN_DATA = "SubmissionView/SubmitDuncanSubmissionData";

//Adjudicator View
export const GET_ADJ_MEDIA_DROPDOWN =
  "DropDown/GetAdjudicatorViewMediaDropDownView";
export const GET_ADJ_MEDIA_BASE = "AdjudicatorView/GetPreSignedUrls";
export const GET_ALL_BASE64VALUE =
  "AdjudicatorView/GetBase64StringForPresignedUrls";
export const SUBMIT_ADJ_DATA = "AdjudicatorView/SubmitAdjudicatorData";
export const GET_ADJ_MEDIA_DATA = "AdjudicatorView/GetAdjudicationMediaData";
export const GET_CITATION_ID = "AdjudicatorView/GenerateNewCitationID";
export const GET_FINE_VIEW = "AdjudicatorView/GetFineView";

//Supervisor View
export const ADJUDICATED_VIEW_DATES = "DropDown/GetAdjudicationDatesDropDown";
export const ADJUDICATED_MEDIA_DATA = "DropDown/GetAllCitationsIDs";
export const GET_CITATION_DATA = "SupervisorView/GetCitationDataById";
export const CITATION_STATUS_UPDATE = "SupervisorView/CitationStatusUpdate";

//Approved Table
export const APPROVED_CITATIONS =
  "ApprovedTable/GetCitationDataForApprovedTable";
export const PDF_VIEW = "ApprovedTable/ViewPDF";
export const DOWNLOAD_CSV = "ApprovedTable/DownloadApprovedTableData";
export const EDIT_CITATIONS = "ApprovedTable/EditApprovedTableData";
export const UPDATE_CITATIONS = "ApprovedTable/UpdateApprovedTableData";
//Reject and Court Preview
export const GET_ALL_REJECTS_DATA = "DropDown/GetAllRejectedMediaDropDown";
export const GET_REJECTED_MEDIA_DATA = "Reject/GetRejectedMediaData";
export const GET_CITATION_FOR_COURT_PREVIEW =
  "CourtPreview/GetCitationDataForCourtPreview";
export const GET_CSV_VIEW_DATA = "CSVView/GetQuickPDData";
export const GET_EDIT_APPROVED_COUNT = "ApprovedTable/GetApprovedTableEditCountView";

//Road Loactions
export const GET_ALL_ROAD_LOCATIONS = "RoadLocation/GetAllRoadLocationsDetails";
export const ADD_OR_UPDATE_LOCATION =
  "RoadLocation/AddOrUpdateRoadLocationDetails";
export const TRAFFIC_LOGIX_DROPDOWN = "DropDown/GetTrafficLogixDropDown";
export const DELETE_LOCATION = "RoadLocation/DeleteRoadLocationDetails";

//Fine
export const GET_FINE_DETAILS = "Fine/GetAllFineDetails";
export const UPDATE_FINE_DETAILS = "Fine/UpdateFineDetails";
//Add Court Date
export const ADD_COURT_DATE = "Court/AddCourtDate";

//Admin
export const GET_ALL_AGENCY_DATA = "SuperAdmin/GetAllAgencyDetails";
export const GET_ALL_AGENCY_USERS_DATA = "SuperAdmin/GetAllUserDetails";
export const ADD_NEW_CUSTOMER = "SuperAdmin/AddCustomer";
export const GET_AGENCY_BY_ID = "SuperAdmin/GetAgencyDetailsById";
export const UPDATE_AGENCY_BY_ID = "SuperAdmin/UpdateAgencyDetailsById";
export const GET_AGENCY_USER_DATA = "SuperAdmin/GetUserDetailsById";
export const UPDATE_AGENCY_USER_DATA = "SuperAdmin/UpdateUserDetailsById";
export const STATUS_UPDATE = "SuperAdmin/UpdateAgencyStatusView";

//QuickPD Report
export const UPLOAD_QUICK_PD_CITATION =
  "QuickPDReports/UploadQuickPdPaidCitations";
// export const GET_XPRESS_BILL_PAY = "QuickPDReports/GetXpressBillPaySummaryLevelReport"
// export const SUMMARY_VIEW_DOWNLOAD = "QuickPDReports/QuickPdReportSummaryDownloadView"
// export const DOWNLOAD_XPRESS_BILL_PAY = "QuickPDReports/GetXpressBillPayReportDownload"
// export const GET_CITATION_LEVEL_REPORT = "QuickPDReports/QuickPdCitationLevelReportView";
// export const CITATION_LEVEL_DOWNLOAD = "QuickPDReports/CitationLevelReportDownloadView"

//MAR, CLA , RNG, OIL- View Report
export const GET_MAR_SUMMARY_REPORT = "QuickPDReports/QuickPdReportSummaryView";
export const DOWNLOAD_MAR_SUMMARY_REPORT =
  "QuickPDReports/QuickPdReportSummaryDownloadView";
export const GET_MAR_CITATION_REPORT =
  "QuickPDReports/QuickPdCitationLevelReportView";
export const DOWNLOAD_MAR_CITATION_REPORT =
  "QuickPDReports/QuickPdCitationLevelReportDownloadView";

//HUD-C, FED-M , WBR2- View Report
export const GET_FED_SUMMARY_REPORT =
  "QuickPDReports/GetXpressBillPaySummaryLevelReport";
export const DOWNLOAD_FED_SUMMARY_REPORT =
  "QuickPDReports/GetXpressBillPayReportDownload";
export const GET_FED_CITATION_REPORT =
  "QuickPDReports/GetXpressBillPayCitationLevelReport";
export const DOWNLOAD_FED_CITATION_REPORT =
  "QuickPDReports/GetXpressBillPayCitationLevelReportDownload";

//ODR
export const GET_ODR_CSV_DATA = "OdrView/ViewCSV";
export const VIEW_ODR_PDF = "OdrView/ViewPDF";
export const GET_ODR_DROPDOWN_DATA = "DropDown/GetOdrDropDownView";
export const SUBMIT_ODR_DATA = "OdrView/OdrCitationSubmitView";
export const ODR_APPROVED_TABLE_DATA = "OdrView/GetOdrApprovedTableView";
export const DOWNLOAD_ODR_APPROVED_TABLE =
  "OdrView/DownloadOdrApprovedTableDataView";

//Review Bin
export const GET_REVIEW_DROPDOWN_DATA =
  "DropDown/GetReviewBinViewMediaDropDown";
export const SEND_REVIEW_BIN_DATA = "ReviewBin/SubmitReviewBinData";

//Agency-Adj-View
export const GET_AGENCY_ADJ_VIEW =
  "DropDown/GetAgencyAdjudicationMediaDropDown";
export const SUBMIT_AGENCY_ADJ_DATA =
  "AgencyAdjudicationBinView/SubmitAgencyAdjudicationBin";
export const GET_AGENCY_ADJ_MEDIA_DATA = "AgencyAdjudicationBinView/GetAgencyAdjudicationBinMediaData"

//Pre-ODR
export const UPLOAD_UNPAID_CITATION_DATA = "PreODR/UploadUnpaidCitationData";
export const GET_ALL_YEARS = "DropDown/GetAllYearsDropDownForPreOdr";
export const GET_ALL_MONTHS = "DropDown/GetAllMonthsDropDownForPreOdr";
export const GET_ALL_DAYS = "DropDown/GetAllDaysDropDownForPreOdr";
export const GET_ALL_CITATIONS_PREODR = "DropDown/GetAllCitationsForPreOdr";
export const GET_CAMERA_CSV_DATA = "PreODR/GetCSVDataForPreOdr";
export const GET_PRE_ODR_APPROVED_DATA = "PreODR/GetDataForPreOdrTable";
export const SUBMIT_PRE_ODR_CITATION = "PreODR/SubmitPreOdrCitation";
export const VIEW_MAILER_PDF = "PreODR/ViewMailerPDF";
export const DELETE_UNPAID_CITATION = "PreODR/DelectUnpaidCitationData";

//Permission Dropdown
export const GET_ALL_PERMISSIONS = "DropDown/GetAllPermissionLevel";

//Counts
export const GET_ADJ_COUNTS_DATA = "QuickPDReports/GetAdjudicatedCitationCountView"

//GreenHood PD pre-ODR
export const GH_UPLOAD_OUTBOUND_TRAFFIC_VIEW = "PreODR/UploadOutboundTrafficView"
export const GH_SUBMIT_OUTBOUND_TRAFFIC_DATA = "PreODR/SubmitOutboundTrafficDataView"
export const GH_GET_APPROVED_OUTBOUND_VIEW_DATA = "PreODR/GetDataForPreOdrTOutboundTrafficView"
export const GH_GET_CSV_OUTBOUND_DATA = "PreODR/GetCSVDataForPreOdrOutboundTraffic"
export const GH_VIEW_OUTBOUND_MAILER_PDF_VIEW = "PreODR/ViewOutboundMailerPDFView"
export const GH_DELETE_OUTBOUND_TICKET_DATA = "PreODR/DeleteOutboundTicketDataView"

//Greenhood Dropdowns
export const GH_GET_OUTOUND_YEAR_DROPDOWN = "DropDown/GetYearsDropdownForOutboundTrafficView"
export const GH_GET_OUTBOUND_MONTHS_DROPDOWN = "DropDown/GetMonthsDropdownForOutboundTrafficView"
export const GH_GET_OUTBOUND_DAYS_DROPDOWN = "DropDown/GetDaysDropdownForOutboundTrafficView"
export const GH_GET_OUTBOUND_ALL_CITATION = "DropDown/GetAllCitationsForOutboundTrafficView"



export const DOWNLOAD_FED_SUMMARY_REPORT_NEW =
  "QuickPDReports/QuickPdReportSplitSummaryDownloadView";

    // Graph API's
export const GET_APPROVED_DATE_ANALYSIS_GRAPH = "QuickPDReports/ApprovedDateAnalysisGraph";
export const GET_MONTH_WISE_CITATION_PAYMENT_STATUS_GRAPH = "QuickPDReports/MonthWiseCitationPaymentStatusGraph";
export const GET_TICKET_SUMMARY_GRAPH = "QuickPDReports/TicketSummaryGraph";
export const GET_DMV_DATA_GRAPH = "QuickPDReports/DuncanActivitySummaryGraph";
export const GET_PAID_SUMARY_IN_DAYS = "QuickPDReports/PaidSummaryInDaysTableView"


//Folder Upload for Super Admin
export const CREATE_NEW_FOLDER = "superadmin/CreateFolder"
export const DELETE_FOLDER = "superadmin/DeleteFolder"
export const GET_FILE_DATA = "superadmin/GetFileData"
export const GET_FOLDER_HIERARCHY = "superadmin/GetFolderHierarchy"
export const UPLOAD_FILES = "superadmin/UploadFiles"
export const DELETE_FILES = "superadmin/DeleteFiles"

//Reminder Notice
export const GET_REMINDER_NOTICE_YEARS = "RemainderNotice/GetRemainderNoticeYears"
export const GET_REMINDER_NOTICE_MONTHS = "RemainderNotice/GetRemainderNoticeMonthsByYear"
export const GET_REMINDER_NOTICE_CITATION_IDS = "RemainderNotice/GetRemainderNoticeCitaionIDs"
export const GET_ALL_REMINDER_NOTICE_DATA = "RemainderNotice/GetRemainderNoticeCitationsData"
export const SEND_REMINDER_NOTICE = "RemainderNotice/SubmitRemainderNoticeAndPDF"
export const GET_REMINDER_NOTICE_PDF = "RemainderNotice/ViewReminderPDF"