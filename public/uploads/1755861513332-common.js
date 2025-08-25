$(document).ready(function () {
    $("#_Confidentiality").modal("show");
    $(".opacity_eighteen").css("opacity", "1");
    $('#_Confidentiality').on('hidden.bs.modal', function () {
        $('html, body').animate({ scrollTop: 0 }, 'slow');
    });
});

var app = angular.module('app', ['ngAnimate']);

app.run(function ($http) {
    $http.defaults.headers.common['X-XSRF-Token'] = angular.element(document.querySelectorAll('input[name="__RequestVerificationToken"]')).attr('value');
})

app.filter('removeSpaces', function () {
    return function (input) {
        if (!input) return '';
        return input.replace(/\s+/g, '');
    };
});

app.controller("questionController", ["$scope", "apiCallsFactory", "$timeout", function questionController($scope, apiCallsFactory, $timeout) {


    //Global Varirables starts

    $scope.isSelected = false;
    $scope.isContinueSelected = false;
    $scope.isSubmitSelected = false;
    $scope.showUnder18Warning = false;

    $scope.totalSteps = 26;
    $scope.currentStep = 1;
    $scope.isSkip = false;
    $scope.progress = ($scope.currentStep / $scope.totalSteps) * 100;

    var _SurveyType = { /*"LandingPage": 1,*/ "DemographicQuestions": 1, "PHQ9": 3, "GAD7": 4, "PTSD": 5, "AUDIT": 6, "Feedback": 7, "FeedbackPart1": 9 }; /*"SurveyLandingPage": 8 */

    var _subOptions = [{
        Text: 'Paid Professional',
        ID: 1
    },
    {
        Text: 'Volunteer',
        ID: 2
    }
        , {
        Text: 'Retired',
        ID: 3
    }];

    $scope.RoleAtEWSQuestions = [{
        RoleID: 1,
        OptionText: 'Ambulance Services',
        subOptions: _subOptions,
        ToolTip: '',
        preferid: '',
        selected: false
    },
    {
        RoleID: 2,
        OptionText: 'Fire Services',
        subOptions: _subOptions,
        ToolTip: 'Includes Fire &amp; Rescue, Rural Fire Services, Country Fire Authority,\n Country Fire Service, Air Services Australia and staff from National\n Parks and Wildlife who attend natural disasters.',
        preferid: '',
        selected: false
    },
    {
        RoleID: 3,
        OptionText: 'Police',
        subOptions: _subOptions,
        ToolTip: 'Includes sworn and unsworn staff.',
        preferid: '',
        selected: false
    },
    {
        RoleID: 4,
        OptionText: 'Surf Life Saving',
        subOptions: _subOptions,
        ToolTip: '',
        preferid: '',
        selected: false
    },
    {
        RoleID: 5,
        OptionText: 'State Emergency Service',
        subOptions: _subOptions,
        ToolTip: '',
        preferid: '',
        selected: false
    },
    {
        RoleID: 6,
        OptionText: 'Marine Rescue',
        subOptions: _subOptions,
        preferid: '',
        ToolTip: '',
        selected: false
    },
    {
        RoleID: 7,
        OptionText: 'Wildlife Rescue',
        subOptions: _subOptions,
        ToolTip: 'Licensed rescuers and carers',
        preferid: '',
        selected: false
    },
    //{
    //    RoleID: 10,
    //    OptionText: 'Retired Emergency Service Worker/Volunteer',
    //    subOptions: _subOptions,
    //    ToolTip: '',
    //    preferid: '',
    //    selected: false
    //},
    {
        RoleID: 8,
        OptionText: 'Other',
        subOptions: [],
        ToolTip: '',
        preferid: '',
        selected: false,
        isOther: true
    },
        //{
        //    RoleID: 9,
        //    OptionText: 'Prefer not to say',
        //    ToolTip: '',
        //    preferid: 'preferid',
        //    selected: false
        //}
    ];

    $scope.RoleAtServiceQuestions = [
        { RoleID: 1, OptionText: 'Recommendation', selected: false },
        { RoleID: 2, OptionText: 'Free access', selected: false },
        { RoleID: 3, OptionText: 'Ease of access and use', selected: false },
        { RoleID: 4, OptionText: 'Confidentiality', selected: false },
        { RoleID: 5, OptionText: 'I didn’t feel ready for face-to-face services yet', selected: false },
        { RoleID: 6, OptionText: 'Other services/strategies haven’t worked for me', selected: false },
        { RoleID: 7, OptionText: 'Other', selected: false, isOther: true }
    ];

    /*newQuestion */
    $scope.ExperiencingMentalHealthcheck = [
        {
            ExperienceRoleID: 1,
            OptionText: 'Low mood',
            selected: false
        },
        {
            ExperienceRoleID: 2,
            OptionText: 'Anxious feelings',
            selected: false
        },
        {
            ExperienceRoleID: 3,
            OptionText: 'Sleep issues',
            selected: false
        },
        {
            ExperienceRoleID: 4,
            OptionText: 'Relationship issues',
            selected: false
        },
        {
            ExperienceRoleID: 5,
            OptionText: 'Thoughts of a traumatic event',
            selected: false
        },
        {
            RoleID: 6,
            OptionText: 'Burnout at work ',
            selected: false
        },
        {
            ExperienceRoleID: 7,
            OptionText: 'Changes in my behaviour at work',
            selected: false
        },
        {
            ExperienceRoleID: 8,
            OptionText: 'Encouragement from a loved one to seek support',
            selected: false
        },
        {
            ExperienceRoleID: 9,
            OptionText: 'Encouragement from a manager/colleague to seek support',
            selected: false
        },
        {
            ExperienceRoleID: 10,
            OptionText: 'I feel fine but was curious to check',
            selected: false
        },
        {
            ExperienceRoleID: 11,
            OptionText: 'Other',
            selected: false,
            isOther: true
        },
    ];

    $scope.KnowUs = [
        {
            KnowUsRoleID: 1,
            OptionText: 'Saw an ad',
            selected: false
        },
        {
            KnowUsRoleID: 2,
            OptionText: 'Searched online',
            selected: false
        },
        {
            KnowUsRoleID: 3,
            OptionText: 'Recommended by a loved one',
            selected: false
        },
        {
            KnowUsRoleID: 4,
            OptionText: 'Recommended by my workplace',
            selected: false
        }
    ];

    /*newQuestion */

    var _SurveyNames = [
        { "SurveyTypeID": _SurveyType.LandingPage, "SurveyName": "LandingPage", },
        { "SurveyTypeID": _SurveyType.PHQ9, "SurveyName": "Generalised Anxiety Disorder", "MinScore": 0, "MaxScore": 27, "CurrentScore": 1 },
        { "SurveyTypeID": _SurveyType.GAD7, "SurveyName": "Depression", "MinScore": 0, "MaxScore": 21, "CurrentScore": 1 },
        { "SurveyTypeID": _SurveyType.PTSD, "SurveyName": "Traumatic experience", "MinScore": 0, "MaxScore": 5, "CurrentScore": 1 },
        //{ "SurveyTypeID": _SurveyType.SurveyLandingPage, "SurveyName": "SurveyLandingPage", }
    ];
    var _MaxSurveyQuestions = { "PHQ9": 9, "GAD7": 8, "PTSD": 8, "AUDIT": 10 };

    //Global Varirables ends

    //$scope.currentPageNo = 1;
    $scope.currentPageNo = 0;
    $scope.reportSubmited = false;
    $scope.UserEmail = "";
    $scope.showVolunteerQuestion = false;
    //BUS-44 Starts
    $scope.States = apiCallsFactory.GetStates();
    $scope.DescribeMeInDetail = apiCallsFactory.DescribeMeInDetail();
    $scope.BushFireSeasons = apiCallsFactory.BushFireSeasons();
    $scope.FeedbackReasonToChooseOptions = apiCallsFactory.GetFeedbackReasonToChooseOptions();
    $scope.FeedbackReasonToChooseDifferentSurveyOption = apiCallsFactory.GetFeedbackReasonToChooseDifferentSurveyOption();
    $scope.stateError = false;
    $scope.DescribeMeInDetailItems = { "Other": 22, "MinEmergencyService": 1, "MaxEmergencyService": 19 };
    $scope.ProcessMentalHealthList = [];
    //BUS-44 Ends
    $scope.ProcessFeedbackPart1List = [];
    $scope.ProcessFeedbackPart1ListofSurveyOptions = [];
    $scope.ProcessBushfireSeasonsList = [];
    var _BushFireSeasons = { "PreferNotToSay": 3 };
    $scope.BushFireSeasonsNotToSay = _BushFireSeasons.PreferNotToSay;
    $scope.IsViewReport = false;
    $scope.IsSurveyData = false;
    $scope.SurveyType = _SurveyType;
    //$scope.currentSurveyType = _SurveyType.LandingPage;
    $scope.currentSurveyType = _SurveyType.DemographicQuestions;

    $scope.currentSurveyIndex = 1;
    //$scope.IsREIntegration = false;
    $scope.currentQuestion = 1;
    $scope.PreviousQuestion = 0;

    $scope.Report = { Name: null, Email: null, IsREIntegration: false };

    $scope.UserID = 0;
    $scope.isLoading = false;
    $scope.EmailSent = false;
    $scope.PHQ9 = { Q1: null, Q2: null, Q3: null, Q4: null, Q5: null, Q6: null, Q7: null, Q8: null, Q9: null };
    $scope.GAD7 = { Q1: null, Q2: null, Q3: null, Q4: null, Q5: null, Q6: null, Q7: null };
    $scope.FDBU = { Email: null, Mobile: null };
    $scope.ShowFeedbackSurvey = true;
    $scope.ShowUserDetailForm = true;
    $scope.emailFormat = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,6}$/;
    $scope.ReportViewed = false;
    $scope.AUDIT = { Q1: 0, Q2: 0, Q3: 0, Q4: 0, Q5: 0, Q6: 0, Q7: 0, Q8: 0, Q9: 0, Q10: 0, Q11: 0 }
    $scope.PTSD = { Memories: 0, HappeningAgain: 0, Nightmares: 0, EmotionalReactions: 0, AvoidingActivities: 0, AvoidingThoughts: 0, Jumpy: 0, OnGuard: 0 }
    $scope.DemographicQuestions = {
        DescribeMeLayer1ID: null, DescribeMeLayer2ID: null, DescribesYouFamilyEmergency: null, Age: "0", Gender: "0", Postcode: null, OtherGender: null, IsSeenDoctor: null, DescribeMeOther: "", VisitingTailored: null, VisitingInformation: null, VisitingEncouragement: null, StateID: null, IsVolunteer: null, IsBushFireAffectedHealth: null,
        VisitingInformationConcern: null, VisitingSeeing: null, VisitingOthers: null, VisitingOthersText: null,
        ServiceFace: null, ServiceDigital: null, ServiceInformation: null, ServiceMood: null, ServiceOther: null, ServiceOtherText: null,
        MentalHealthOther: null, RoleAtEWS: "0", OtherRoleAtEWS: "", ExperienceOtherRole: "", OtherRoleAtService: "", RolRoleAtProfessioneAtEWS: "0", OtherRoleAtProfession: ""
    };
    $scope.RoleAtEWSChecks = {
        RoleAtEWSChecksValues: null
    };
    $scope.ExperienceRoleChecks = {
        ExperienceAtEWSChecksValues: null
    };
    $scope.KnowUsRoleAtAWSChecks = {
        KnowUsRoleChecksValues: null
    };
    $scope.ratherAnswer = true;
    $scope.isconsentProvided = false;

    $scope.showFireTooltip = false;
    $scope.showPoliceTooltip = false;
    $scope.showAnimalRescueTooltip = false;


    var Randomized = Math.random();
    if (Randomized > 0.5)
        //Jac asked to show this all the time. email :OC support request
        $scope.ratherAnswer = true;
    else
        $scope.DemographicQuestions.OtherGender = null;
    //Manage user's survey order
    var _CurrentSurveys = [];
    $scope.feebackSourceData = '';
    $scope.feebackSourceDataForDifferentService = '';
    //_CurrentSurveys.push(_SurveyType.LandingPage);
    _CurrentSurveys.push(_SurveyType.DemographicQuestions);
    _CurrentSurveys.push(_SurveyType.PHQ9);
    _CurrentSurveys.push(_SurveyType.GAD7);
    _CurrentSurveys.push(_SurveyType.PTSD);
    _CurrentSurveys.push(_SurveyType.FeedbackPart1);
    _CurrentSurveys.push(_SurveyType.Feedback);



    var progressBarMaxQuestion = 0;
    progressBarMaxQuestion = _MaxSurveyQuestions.PHQ9;
    progressBarMaxQuestion += _MaxSurveyQuestions.GAD7;
    progressBarMaxQuestion += _MaxSurveyQuestions.PTSD;

    /* progressBarMaxQuestion -= 1;*/
    $scope.progressBarMaxQuestion = progressBarMaxQuestion;
    $scope.progressBarCurrentQuestion = 0;


    $scope.$watch('DemographicQuestions.Age', function (newValue, oldValue) {
        if (newValue && newValue !== oldValue) {
            $timeout(function () {
                const nextQuestion = document.getElementById('q2');
                if (nextQuestion) {
                    nextQuestion.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }, 500);
        }
    });

    $scope.$watch('DemographicQuestions.Gender', function (newValue, oldValue) {
        if (newValue && newValue !== oldValue) {
            $timeout(function () {
                const nextQuestion = document.getElementById('q3');
                if (nextQuestion) {
                    nextQuestion.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }, 500);
        }
    });

    $scope.$watch('DemographicQuestions.StateID', function (newValue, oldValue) {

        if (newValue && newValue !== oldValue) {
            $timeout(function () {
                const nextQuestion = document.getElementById('q4');
                if (nextQuestion) {
                    nextQuestion.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }, 500);
        }
    });

    $scope.$watch('DemographicQuestions.User_indigenous_identity', function (newValue, oldValue) {
        if (newValue && newValue !== oldValue) {
            $timeout(function () {
                const nextQuestion = document.getElementById('q5');
                if (nextQuestion) {
                    nextQuestion.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }, 500);
        }
    });

    $scope.$watch('DemographicQuestions.RoleAtProfession', function (newValue, oldValue) {

        if (newValue && newValue !== oldValue) {
            $timeout(function () {
                const nextQuestion = document.getElementById('q5');
                if (nextQuestion) {
                    nextQuestion.scrollIntoView({ behavior: 'smooth', block: 'center' });
                } else {
                    const nextQuestion = document.getElementById('q6');
                    if (nextQuestion) {
                        nextQuestion.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                }
            }, 500);
        }
    });

    $scope.$watch('DemographicQuestions.RoleAtEWS', function (newValue, oldValue) {
        if (newValue && newValue !== oldValue) {
            $timeout(function () {
                const nextQuestion = document.getElementById('q7');
                if (nextQuestion) {
                    nextQuestion.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }, 300);
        }
    });

    $scope.$watch('DemographicQuestions.RoleAtServices', function (newValue, oldValue) {
        if (newValue && newValue !== oldValue) {
            $timeout(function () {
                const nextQuestion = document.getElementById('q9');
                if (nextQuestion) {
                    nextQuestion.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }, 300);
        }
    });

    $scope.$watch('DemographicQuestions.RoleAtExperience', function (newValue, oldValue) {
        if (newValue && newValue !== oldValue) {
            $timeout(function () {
                const nextQuestion = document.getElementById('q8');
                if (nextQuestion) {
                    nextQuestion.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }, 300);
        }
    });
    $scope.$watch('DemographicQuestions.RoleAtKnowUs', function (newValue, oldValue) {
        if (newValue && newValue !== oldValue) {
            $timeout(function () {
                const nextQuestion = document.getElementById('q6');
                if (nextQuestion) {
                    nextQuestion.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }, 300);
        }
    });




    $scope.blockVisible = false;
    $scope.selectedTempValue = null;
    $scope.selectedQuestionKey = null;
    $scope.selectedQuestionValue = null;

    $scope.showBlock = function (questionKey, value) {
        $scope.selectedQuestionKey = questionKey;
        $scope.selectedQuestionValue = value;
        $scope.blockVisible = true;
    };

    $scope.continueAfterBlock = function () {
        $scope.saveUserResponse($scope.selectedQuestionKey, $scope.selectedQuestionValue);
        //$scope.blockVisible = false;
    };

    $scope.onPHQ9Q1Change = function (value) {
        $scope.blockVisible = true;
        setTimeout(function () {
            var element = document.getElementById("B1");
            if (element) {
                element.scrollIntoView({ behavior: "smooth", block: "center" });
            }
        }, 100);
    };

    $scope.onPHQ9Q2Change = function (value) {
        $scope.blockVisible = true;
        setTimeout(function () {
            var element = document.getElementById("B2");
            if (element) {
                element.scrollIntoView({ behavior: "smooth", block: "center" });
            }
        }, 100);
    };

    $scope.onPHQ9Q3Change = function (value) {
        $scope.blockVisible = true;
        setTimeout(function () {
            var element = document.getElementById("B3");
            if (element) {
                element.scrollIntoView({ behavior: "smooth", block: "center" });
            }
        }, 100);
    };

    $scope.onPHQ9Q4Change = function (value) {
        $scope.blockVisible = true;
        setTimeout(function () {
            var element = document.getElementById("B4");
            if (element) {
                element.scrollIntoView({ behavior: "smooth", block: "center" });
            }
        }, 100);
    };


    $scope.onPHQ9Q5Change = function (value) {
        $scope.blockVisible = true;
        setTimeout(function () {
            var element = document.getElementById("B5");
            if (element) {
                element.scrollIntoView({ behavior: "smooth", block: "center" });
            }
        }, 100);
    };

    $scope.onPHQ9Q6Change = function (value) {
        $scope.blockVisible = true;
        setTimeout(function () {
            var element = document.getElementById("B6");
            if (element) {
                element.scrollIntoView({ behavior: "smooth", block: "center" });
            }
        }, 100);
    };

    $scope.onPHQ9Q7Change = function (value) {
        $scope.blockVisible = true;
        setTimeout(function () {
            var element = document.getElementById("B7");
            if (element) {
                element.scrollIntoView({ behavior: "smooth", block: "center" });
            }
        }, 100);
    };

    $scope.onPHQ9Q8Change = function (value) {
        $scope.blockVisible = true;
        setTimeout(function () {
            var element = document.getElementById("B8");
            if (element) {
                element.scrollIntoView({ behavior: "smooth", block: "center" });
            }
        }, 100);
    };

    $scope.onPHQ9Q9Change = function (value) {
        $scope.blockVisible = true;
        setTimeout(function () {
            var element = document.getElementById("B9");
            if (element) {
                element.scrollIntoView({ behavior: "smooth", block: "center" });
            }
        }, 100);
    };
    /*blockmessage*/



    //Scope events
    $scope.EmailSentSuccessfully = function () {
        $scope.isLoading = false;
        $scope.EmailSent = true;

    }


    $scope.clearPostCode = function () {
        $scope.DemographicQuestions.Postcode = null;

    }

    $scope.showSendEmailPanel = function () {
        $scope.EmailSent = false;
        $scope.emailReport = true;
        $scope.ReportViewed = false;
        setTimeout(function () { document.querySelector('#txtName').focus() }, 100);
    }

    //
    $scope.ClearRadioButtonAttribute = function (id) {
        //document.getElementById(id).removeAttribute("is-checked");

    }
    $scope.uncheck = function (event, model, i) {
        if ($scope[model][i] == event.target.value) {
            $scope.checked = false;
            $scope[model][i] = null;
        }

    }


    $scope.processMentalHealthOther = function () {
        $scope.DemographicQuestions.MentalHealthNotToSay = null;
    }
    $scope.OpenAutoComplete = function () {
        TriggerDownKey();
    }
    function TriggerDownKey() {
        var e = jQuery.Event("keydown");
        e.keyCode = 50;
        $("#pin").trigger(e);
    }

    $scope.SaveUserData = false;
    $scope.SaveUserDataEvent = function () {
        $scope.SaveUserData = !$scope.SaveUserData;
    }
    PushSurveyNameInGTM(_SurveyType.LandingPage);

    $scope.isDataPostIsInProgress = false;


    $scope.under18 = function (processDescribeMeDetail) {

        if (processDescribeMeDetail.Age == 1) {
            $("#Under18Modal").modal("show");
            $(".opacity_eighteen").css("opacity", "0.5");
            SaveDemographicQuestionsSurveyData(false);
        }
    };

    $scope.above18 = function (processDescribeMeDetail) {

        if (processDescribeMeDetail.Age > 1) {
            $(".opacity_eighteen").css("opacity", "1");
        }
    };


    $scope.processDescribeMeDetail = function (data) {
        $scope.DemographicQuestions.IsVolunteer = null;
        if (data.ID == 21) {
            $("#Under18Modal").modal("show");
            SaveDemographicQuestionsSurveyData(false);
        }
        if (isEmergencyService(data.ID)) {
            $scope.showVolunteerQuestion = true;
        }
        else {
            $scope.showVolunteerQuestion = false;
            $scope.IsVolunteer = null;
            $scope.VolunteerError = false;
        }
        $scope.DemographicQuestions.DescribeMeOther = null;
    };

    var isEmergencyService = function (id) {
        if (id >= $scope.DescribeMeInDetailItems.MinEmergencyService && id <= $scope.DescribeMeInDetailItems.MaxEmergencyService)
            return true;
        else
            return false;
    }
    $scope.processDescribeMeDetailOtherOption = function () {
        if ($scope.DemographicQuestions.DescribeMeOther != null && $scope.DemographicQuestions.DescribeMeOther != undefined && $scope.DemographicQuestions.DescribeMeOther != "") {
            $scope.DemographicQuestions.DescribeMeLayer2ID = $scope.DescribeMeInDetailItems.Other;
            $scope.showVolunteerQuestion = false;
            $scope.IsVolunteer = null;
            $scope.VolunteerError = false;
        }
        else {

        }
    }

    $scope.ClearPreferNotToSay = function (model, value, event) {
        if (event.target.getAttribute("is-checked") == "true") {
            $scope.DemographicQuestions[model] = null;
            event.target.removeAttribute("is-checked")
        }
        else
            event.target.setAttribute("is-checked", "true")
    }

    $scope.GetSelectedStateName = function () {
        return GetCurrentSelectedStateName();
    }

    $scope.skipPTSDAndGoToFeedback = function () {
        document.getElementsByClassName('progress-bar')[0].style.width = "100%";
        var feedbackIndex = _CurrentSurveys.indexOf(_SurveyType.FeedbackPart1);
        if (feedbackIndex !== -1) {
            $scope.currentSurveyIndex = feedbackIndex + 1;
            $scope.currentSurveyType = _SurveyType.FeedbackPart1;
            IsSkip = true
            NewSaveFeedbackPart1SurveyData()
        } else {
            console.error('FeedbackPart1 not found in survey list');
        }
    };
    var ValidatePage1 = function () {
        var isValid = true;

        //state validation
        if ($scope.DemographicQuestions.StateID == null) {
            $scope.stateError = true;
            isValid = false;
        }
        else {
            $scope.stateError = false;

            //DescribeMeDetail validation
            if ($scope.DemographicQuestions.DescribeMeLayer2ID == null) {
                $scope.DescribeMeInDetailError = true;
                isValid = false;
            }
            else {
                $scope.DescribeMeInDetailError = false;

                //Volunteer validation 
                if (isEmergencyService($scope.DemographicQuestions.DescribeMeLayer2ID)) {
                    if ($scope.DemographicQuestions.IsVolunteer == null) {
                        $scope.VolunteerError = true;
                        isValid = false;
                    }
                    else
                        $scope.VolunteerError = false;
                }
                else
                    $scope.VolunteerError = false;

            }
        }

        return isValid;
    }

    var ValidatePage2 = function () {
        var isValid = true;

        if ($scope.DemographicQuestions.IsSeenDoctor == null) {
            $scope.HealthcareWorkerError = true;
            isValid = false;
        }
        else
            $scope.HealthcareWorkerError = false;

        if ($scope.DemographicQuestions.IsBushFireAffectedHealth == null) {
            $scope.BushFireAffectedHealthError = true;
            isValid = false;
        }
        else
            $scope.BushFireAffectedHealthError = false;


        if ($scope.ProcessBushfireSeasonsList.length == 0
        ) {
            $scope.BushfireSeasonsError = true;
            isValid = false;
        }
        else
            $scope.BushfireSeasonsError = false;


        if ($scope.ProcessMentalHealthList.length == 0
            && ($scope.DemographicQuestions.MentalHealthNotToSay == null)
            && ($scope.DemographicQuestions.MentalHealthOther == null)
        ) {
            $scope.MentalHealthError = true;
            isValid = false;
        }
        else
            $scope.MentalHealthError = false;

        return isValid;
    }

    var ValidatePage3 = function () {
        var isValid = true;
        if ($scope.DemographicQuestions.Gender == "0" || $scope.DemographicQuestions.Gender == null) {
            $scope.genderError = true;
            isValid = false;
        }
        else
            $scope.genderError = false;

        if ($scope.DemographicQuestions.Age == "0" || $scope.DemographicQuestions.Age == null) {
            $scope.ageError = true;
            isValid = false;
        }
        else
            $scope.ageError = false;

        if ($scope.DemographicQuestions.Postcode == null || $scope.DemographicQuestions.Postcode == "") {

            $scope.postCodeError = true;
            isValid = false;
        }
        else {
            if ($scope.DemographicQuestions.Postcode.indexOf(",") == -1) {

                $scope.postCodeError = true;
                isValid = false;
            }
            else {
                var tempData = $scope.DemographicQuestions.Postcode;
                tempData = tempData.split(",");

                if (tempData[1].trim().split(" ")[0].length == 2 && tempData[1].trim().split(" ")[2].length < 4) {

                    $scope.postCodeError = true;
                    isValid = false;
                }

                else if (tempData[1].trim().split(" ")[0].length > 2 && tempData[1].trim().split(" ")[1].length < 4) {

                    $scope.postCodeError = true;
                    isValid = false;
                }

                else
                    $scope.postCodeError = false;
            }

        }

        if ($scope.DemographicQuestions.Email != null && $scope.DemographicQuestions.Email != "") {
            if (!validateEmail($scope.DemographicQuestions.Email)) {
                $scope.emailError = true;
                isValid = false;
            }
            else
                $scope.emailError = false;
        }
        else if ($scope.DemographicQuestions.Email == null || $scope.DemographicQuestions.Email == "") {
            $scope.emailError = false;
        }


        if ($scope.DemographicQuestions.Mobile != null && $scope.DemographicQuestions.Mobile != "") {
            if (!validateMobileNumber($scope.DemographicQuestions.Mobile)) {
                $scope.MobileError = true;
                isValid = false;
            }
            else
                $scope.MobileError = false;
        }
        else if ($scope.DemographicQuestions.Mobile == null || $scope.DemographicQuestions.Mobile == "") {
            $scope.MobileError = false;
        }

        return isValid;
    }
    function validateMobileNumber(mobileNumber) {
        const re = /^(\+?614|04)[0-9]{8}$/;
        return re.test(String(mobileNumber).toLowerCase());
    }


    function validateEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    $scope.IsMentalHealthItemSelected = function (currentVal) {
        return $scope.ProcessMentalHealthList.indexOf(currentVal) > -1;
    }

    $scope.ProcessMentalHealthData = function (currentVal) {
        var data = $scope.ProcessMentalHealthList;
        if (data.indexOf(7) > -1) {
            data.splice(data.indexOf(7), 1);
        }
        if (data.indexOf(currentVal) > -1) {
            data.splice(data.indexOf(currentVal), 1);
        }
        else
            data.push(currentVal);
        $scope.ProcessMentalHealthList = data;
        $scope.DemographicQuestions.MentalHealthNotToSay = null;
        $scope.ClearRadioButtonAttribute("MentalHealthNotToSay");
    }
    var ValidateFeedbackPart1SurveyData = function () {
        var isValid = true;
        if ($scope.ProcessFeedbackPart1List.length == 0) {
            $scope.FeedbackSurveyPart1Error = true;
            isValid = false;
        }
        else
            $scope.FeedbackSurveyPart1Error = false;
        return isValid;
    };

    $scope.ClearValidation = function (value, model) {
        if (value == '' && value != undefined) {
            $scope[model] = false;
        }
    }

    $scope.ClearReportValidation = function (value, model) {
        if (value != '' && value != undefined) {
            $scope[model] = false;
        }
        else {
            $scope[model] = true;
            if (model == 'EmailError')
                $scope.InValidEmail = false;
        }
    }

    $scope.SaveFeedbackPart1SurveyData = function () {
        SaveFeedbackSurveyPart1Data();
        $scope.ViewReport();
    }

    var isRequestInProgress = false;
    var reportData = '';
    var isAjaxCompleted = false;
    const percentageText = document.getElementById('percentage');
    const progressFill = document.getElementById('progress-fill');
    const finalMessage = document.getElementById('final-message');
    const statusIcon = document.getElementById('status-icon');
    const additionalText = document.querySelector('.additional-text');
    const centeredText = document.querySelector('.centered-texts');

    function NewSaveFeedbackPart1SurveyData() {
        //$(".Getting_Started").addClass('');
        $(".Getting_Started").text('Your Report');
        $(".Mentalhealthmaindivs").addClass("Mentalhealthmaindivsdummy");
       
        $scope.isSubmitSelected = true;
        $('.header-logo-wrapperr').addClass('skeleton');
        $('p.gray-out-text.feedback').css('display', 'none');
        $('.suvery-container.first_suvery_container').css('display', 'none');
        $('.btn.btn-primary-next').css('display', 'none');
        $('.header-logo-wrapperr img').css('display', 'none');
        $('.speech-bubbles, .text, .down-arrow').css({
            'display': 'none',
            'color': 'transparent'
        });
        $('.service-header').addClass('header-image-replaced');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        $('#popup').hide();
        document.getElementById('popup-overlay').style.display = 'none';
        /*document.body.classList.remove('no-scroll');*/
        var htmlContent = `
        <div class="" style="padding: 60px;">
            <div class="row">
                <div class="col-lg-12 design"></div>
            </div>
            <br />
            <div class="row">
                <div class="col-lg-12 design"></div>
            </div>

            <br />
             <div class="row">
                <div class="col-lg-12 design"></div>
            </div>

            <br />
             <div class="row">
                <div class="col-lg-12 design"></div>
            </div>

            <br />
             <div class="row">
                <div class="col-lg-12 design"></div>
            </div>

            <br />
             <div class="row">
                <div class="col-lg-12 design"></div>
            </div>

            <br />
             <div class="row">
                <div class="col-lg-12 design"></div>
            </div>

            <br />
             <div class="row">
                <div class="col-lg-12 design"></div>
            </div>

            <br />
             <div class="row">
                <div class="col-lg-12 design"></div>
            </div>

            <br />
            <div class="row" style="width: 50%;">
                <div class="col-lg-12 design"></div>
            </div>
        </div>
    `;

        isRequestInProgress = true;
        isProgresssBarInProgress = true;

        SaveFeedbackSurveyPart1Data();

        $('#popup').show();
        document.getElementById('popup-overlay').style.display = 'flex';
        startProgress();
        setTimeout(function () {
            if (isRequestInProgress) {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                document.getElementById('popup-overlay').style.display = 'flex';
                document.body.classList.add('no-scroll');
                $('#popup').css('display', 'block');
                $('#popup').show();
                $('.feedback-part1-container').append(htmlContent);
            }
        }, 1000);
    }

    function startProgress() {
        document.body.classList.remove('no-scroll');
        NewViewReport(function () {
            isRequestInProgress = false;
        });
    }


    function handleReportShowing() {
        percentageText.style.display = "block";
        additionalText.style.display = "none";
        finalMessage.style.display = "block";
        centeredText.style.display = "none";
        /*statusIcon.src = "https://cdn-icons-png.flaticon.com/512/190/190411.png"; */
        statusIcon.src = "../images/Frame.svg";
        statusIcon.style.width = "48px";
        statusIcon.style.height = "48px";

        setTimeout(function () {

            var newContent = reportData;

            // Append new content to the body content container
            $('.bodycontent.container-fluid').html(newContent);
            // Remove skeleton classes and reset styles
            $('.service-header').removeClass('header-image-replaced');
            $('.bodycontent.container-fluid .service-header .body-content').removeClass('skeleton');
            $('.header-logo-wrapperr').removeClass('skeleton');
            $('p.gray-out-text.feedback').css('display', 'block');
            $('.suvery-container.first_suvery_container').css('display', 'block');
            $('.btn.btn-primary-next').css('display', 'block');
            $('.header-logo-wrapperr img').css('display', 'block');
            $('.speech-bubbles, .text, .down-arrow').css({
                'display': 'block',
                'color': '#ffff'
            });

            // Hide certain elements
            $('#unlikely').hide();
            $('#likely').hide();
            $('#uncheckedimage').hide();
            $('#checkedimage').hide();
            $('#uncheckedimageunchecked').hide();
            $('#checkedimageunchecked').hide();
            $('#grayscale').css('filter', 'grayscale(100%)');

            // Handling checkbox state changes
            if ($('#unlikely').is(':checked')) {
                $('#uncheckedimage').show();
                $('#checkedimageunchecked').show();
                $('#Unlikelylable').css('color', 'black');
            } else {
                $('#Unlikelylable').css('color', 'grey');
            }

            if ($('#likely').is(':checked')) {
                $('#checkedimage').show();
                $('#uncheckedimageunchecked').show();
                $('#Likelylable').css('color', 'black');
            } else {
                $('#Likelylable').css('color', 'grey');
            }

            // Event listeners for checkboxes
            $('#unlikely').change(function () {
                if ($(this).is(':checked')) {
                    $('#uncheckedimage').show();
                    $('#checkedimageunchecked').show();
                    $('#Unlikelylable').css('color', 'black');
                } else {
                    $('#uncheckedimage').hide();
                    $('#checkedimageunchecked').hide();
                    $('#Unlikelylable').css('color', 'grey');
                }
            });

            $('#likely').change(function () {
                if ($(this).is(':checked')) {
                    $('#checkedimage').show();
                    $('#uncheckedimageunchecked').show();
                    $('#Likelylable').css('color', 'black');
                } else {
                    $('#checkedimage').hide();
                    $('#uncheckedimageunchecked').hide();
                    $('#Likelylable').css('color', 'grey');
                }
            });
            $(".MENTAL_HEALTH_CHECK").text('MENTAL HEALTH CHECK');
            $(".Getting_Started").text('Your report');
            $(".reporting").addClass("reportstyle");

        }, 500);
        document.body.classList.remove('no-scroll');
    }



    async function NewViewReport(callback) {

        let percent = 0;
        const interval = setInterval(() => {
            if (percent <= 100) {
                percentageText.textContent = `${percent}%`;
                progressFill.style.width = `${percent}%`;
                percent++;
            }
            else {
                if (isAjaxCompleted) {
                    clearInterval(interval);
                    handleReportShowing();
                }
            }
        }, 300);

        $scope.IsViewReport = true;
        $scope.ReportViewed = true;
        $scope.ShowFeedbackSurvey = true;


        // Send event to Google Tag Manager (GTM)
        apiCallsFactory.PushDataToGTM({
            'event': 'questionnaire-event',
            'questionnaireEvent': 'view-report-clicked',
            'questionnaireCategory': 'bushfire',
            'questionnaireName': '',
            'questionnaireSecondaryName': ''
        });

        var url = '/Report/LatestIndex?userID=' + $scope.UserGUID + "&currentSurveys=" + GetCurrentSurveyString();

        window.userGUID = $scope.UserGUID;
        window.surveyData = GetCurrentSurveyString();

        $.ajax({
            url: url,
            type: 'GET',
            async: true,
            success: function (data) {
                reportData = data;
                isAjaxCompleted = true;
                clearInterval(interval);
                for (let i = percent; i <= 100; i++) {
                    percentageText.textContent = `${i}%`;
                    progressFill.style.width = `${i}%`;
                    if (i === 100) {
                        handleReportShowing();
                    }
                }
            },
            error: function (xhr, status, error) {
                console.error('Error loading report:', error);
                $('.body-content').append('<p>Error loading report. Please try again later.</p>');
            }
        });


    };

    function ValidateEmailConsent() {
        var isValid = true;

        if ($scope.Report.Email == null || $scope.Report.Email == "") {
            //$scope.EmailError = true;
            //$scope.InValidEmail = false;
            //isValid = false;
            $scope.InValidEmail = false;
        }
        else {
            //$scope.EmailError = false;
            if (!validateEmail($scope.Report.Email)) {
                $scope.InValidEmail = true;
                isValid = false;
            }
            else
                $scope.InValidEmail = false;
        }

        return isValid;
    }

    var SaveFeedbackSurveyPart1Data = function () {

        var requestData = [];

        var FeedBackrequestData = [];
        for (var i = 0; i < $scope.ProcessFeedbackPart1List.length; i++) {
            let otherText = null;
            if ($scope.ProcessFeedbackPart1List[i] == 11) {
                otherText = $scope.feebackSourceData;
            }
            requestData.push({
                UserID: $scope.UserID,
                ReasonToChooseOptionsID: $scope.ProcessFeedbackPart1List[i],
                OtherText: otherText
            });
        }
        for (var i = 0; i < $scope.ProcessFeedbackPart1ListofSurveyOptions.length; i++) {
            let otherText = null;
            if ($scope.ProcessFeedbackPart1ListofSurveyOptions[i] == 10) {
                otherText = $scope.feebackSourceDataForDifferentService;
            }
            FeedBackrequestData.push({
                UserID: $scope.UserID,
                ReasonToChooseOptionsID: $scope.ProcessFeedbackPart1ListofSurveyOptions[i],
                OtherText: otherText
            });
        }

        var datarequest = {
            data: requestData,
            email: $scope.Report.Email,
            ID: $scope.UserID,
            dataforDifferrntService: FeedBackrequestData
        };

        apiCallsFactory.SaveFeedbackPart1(datarequest).then(function (data) {

            handleSurveyResponse(data, function () {
                /*  MoveToNextSurvey();*/
                /*  setTimeout(function () { document.querySelector('#txtEmail').focus() }, 100);*/
            });
        }, handleSurveyErrorCallback);
    }

    $scope.IsFeedbackPart1ItemSelectected = function (currentVal) {
        return $scope.ProcessFeedbackPart1List.indexOf(currentVal) > -1;
    }

    $scope.IsFeedbackPart1ItemSelectectedForSurvey = function (currentVal) {
        return $scope.ProcessFeedbackPart1ListofSurveyOptions.indexOf(currentVal) > -1;
    }

    $scope.IsBushFireSeasonItemSelectected = function (currentVal) {
        return $scope.ProcessBushfireSeasonsList.indexOf(currentVal) > -1;
    }

    $scope.GetPostCode = function () {
        if ($scope.DemographicQuestions.Postcode != null
            && $scope.DemographicQuestions.Postcode != undefined
            && $scope.DemographicQuestions.Postcode != ""
            && $scope.DemographicQuestions.Postcode.length >= 4
        ) {
            apiCallsFactory.GetAutoCompleteData($scope.DemographicQuestions.Postcode).then(function (data) {
                data = data.data;
                data = ProcessPostCodes(data);
                $("#pin").autocomplete({
                    source: data.length > 0 ? data : ["No result found"],
                    create: function (event, ui) {
                        TriggerDownKey();
                    },
                    select: function (event, ui) {
                        var value = ui.item.value;
                        //store in session
                        $scope.DemographicQuestions.Postcode = value
                    }
                });
                TriggerDownKey();
            });
        }
    }

    function GetCurrentSelectedStateName() {
        var currentState = "";
        for (var i = 0; i < $scope.States.length; i++) {
            if ($scope.DemographicQuestions.StateID == $scope.States[i].ID)
                currentState = $scope.States[i].Name;
        }
        return currentState;
    }

    function ProcessPostCodes(data) {
        var tempAutocompleteData = [];
        var currentState = GetCurrentSelectedStateName();
        for (var i = 0; i < data.length; i++) {
            var tempData = data[i];
            tempData = tempData.split(",");
            if (tempData[1].trim().split(" ")[0].toLowerCase() == currentState.toLowerCase())
                tempAutocompleteData.push(data[i]);
        }
        return tempAutocompleteData;
    }

    $scope.ProcessFeedbackPart1Data = function (currentVal) {
        var data = $scope.ProcessFeedbackPart1List;
        //if (currentVal == 10) {
        //    var isNotInList = false;
        //    if (data.indexOf(currentVal) == -1) {
        //        isNotInList = true;
        //    }
        //    data = [];
        //    if (isNotInList)
        //        data.push(10)
        //}
        //else {
        //    if (data.indexOf(10) > -1) {
        //        data.splice(data.indexOf(10), 1);
        //    }

        if (data.indexOf(currentVal) > -1) {
            data.splice(data.indexOf(currentVal), 1);
        }
        else
            data.push(currentVal);
        //}

        $scope.ProcessFeedbackPart1List = data;
    }
    $scope.CheckOtherSelected = function () {
        var isShow = false;
        if ($scope.ProcessFeedbackPart1List.indexOf(11) > -1)
            isShow = true;
        if (!isShow) {
            $scope.feebackSourceData = '';
        }

        return isShow;
    };
    $scope.CheckOtherSelectedForDifferentService = function () {

        var isShow = false;
        if ($scope.ProcessFeedbackPart1ListofSurveyOptions.indexOf(10) > -1)
            isShow = true;
        if (!isShow) {
            $scope.feebackSourceDataForDifferentService = '';
        }

        return isShow;
    };

    $scope.ProcessFeedbackPartDataSecondQuestion = function (currentVal) {
        var data = $scope.ProcessFeedbackPart1ListofSurveyOptions;

        if (data.indexOf(currentVal) > -1) {
            data.splice(data.indexOf(currentVal), 1);
        }
        else
            data.push(currentVal);

        $scope.ProcessFeedbackPart1ListofSurveyOptions = data;
    }

    $scope.ProcessBushFireSeasonData = function (currentVal) {
        var data = $scope.ProcessBushfireSeasonsList;
        if (currentVal == _BushFireSeasons.PreferNotToSay) {
            var isNotInList = false;
            if (data.indexOf(currentVal) == -1) {
                isNotInList = true;
            }
            data = [];
            if (isNotInList)
                data.push(_BushFireSeasons.PreferNotToSay)
        }
        else {
            if (data.indexOf(_BushFireSeasons.PreferNotToSay) > -1) {
                data.splice(data.indexOf(_BushFireSeasons.PreferNotToSay), 1);
            }

            if (data.indexOf(currentVal) > -1) {
                data.splice(data.indexOf(currentVal), 1);
            }
            else
                data.push(currentVal);
        }

        $scope.ProcessBushfireSeasonsList = data;
    }


    $scope.ProcessMentalHealthNotToSay = function () {
        $scope.ProcessMentalHealthList = [];
        $scope.ProcessMentalHealthList.push(7);
        $scope.DemographicQuestions.MentalHealthOther = null;
    }

    $scope.SaveDemographicPage0 = function () {

        $scope.isSelected = true;
        SaveDemographicQuestionsSurveyData(true);
        $(".Getting_Started").text('Health Questions')
        nextStep();

    }

    function updateLoading() {
        const loadingBar = document.querySelector('.loading-bar');
        const loadingPercentage = document.getElementById('loadingPercentage');
        let percentage = 0;
        function incrementLoading() {
            if (percentage <= 100) {
                percentage++;
                loadingBar.style.width = percentage + '%';
                loadingPercentage.textContent = percentage + '%';
                setTimeout(incrementLoading, 40); // Adjust timing as needed
            }
        }

        incrementLoading(); // Start the increment process
    }

    $scope.SaveDemographicPage1 = function () {
        if (ValidatePage1()) {
            SaveDemographicQuestionsSurveyData(true);
        }
        else {
            movePageToError();
        }
    }


    $scope.SaveDemographicPage2 = function () {
        if (ValidatePage2()) {
            SaveDemographicQuestionsSurveyData(true);
        }
        else {
            movePageToError();
        }
    }
    $scope.SaveDemographicPage3 = function () {
        if (ValidatePage3()) {
            SaveDemographicQuestionsSurveyData(true);
        }
        else {
            movePageToError();
        }
    }

    function movePageToError() {
        $timeout(function () {
            if ($('.validation-error:visible').length > 0) {
                var TopOffset = $($('.validation-error:visible')[0]).offset().top - 100;
                $('html,body').animate({ scrollTop: TopOffset }, 300);
            }
        }, 500);
    }

    $scope.saveUserResponse = function (key, value) {
        //$scope.blockVisible = false;
        $scope.isContinueSelected = false;
        if (key === '') {
            $scope.isContinueSelected = true;
        }
        if (!$scope.isDataPostIsInProgress) {
            $scope.isDataPostIsInProgress = true;
            var isNonSavingDataQuestionOrSurvey = false;
            var isNonSavingDataQuestionOrSurvey_skip = false;
            //if ($scope.currentSurveyType == _SurveyType.PHQ9 && $scope.currentQuestion == 9) {
            //    isNonSavingDataQuestionOrSurvey_skip = true;
            //}
            if ($scope.currentSurveyType == _SurveyType.PHQ9 && $scope.currentQuestion == 10) {
                isNonSavingDataQuestionOrSurvey = true;
            }
            if (!isNonSavingDataQuestionOrSurvey) {
                SaveSurveyResponse(key, value, MoveUserToNextStep);
                if (isNonSavingDataQuestionOrSurvey_skip) {
                    MoveUserToNextStep();
                    $scope.isDataPostIsInProgress = false;
                }
            }
            else {
                MoveUserToNextStep();
                $scope.isDataPostIsInProgress = false;
            }
        }

    }

    var MoveUserToNextStep = async function (key, value) {
        if (($scope.currentSurveyType == _SurveyType.PHQ9) || $scope.currentSurveyType != _SurveyType.PHQ9)
            PushAnswerQuestionDataInGTM(value, 'bushfire', $scope.currentQuestion);
        if ($scope.currentQuestion == 1) {
            var event = 'started';
            if (userSelectedSurveys.indexOf($scope.currentSurveyType) >= 0)
                event = 'secondary-questionnaire-started';
            PushQuestionAnswersStarted(event);
        }
        if ($scope.currentQuestion == GetMaxQuestionCountBySurveyType($scope.currentSurveyType)) {
            var event = 'completed';
            if (userSelectedSurveys.indexOf($scope.currentSurveyType) >= 0)
                event = 'secondary-questionnaire-completed';
            PushAllQuestionAnswersForQuestionnaire(event);
        }



        if ($scope.currentSurveyType == _SurveyType.PHQ9 && key == 'SuicidalThoughts' && value == 0) {
            PushAllQuestionAnswersForQuestionnaire();
            PushAllQuestionAnswersForQuestionnaire('completed');
            $scope.progressBarCurrentQuestion++;
            $scope.progressBarCurrentQuestion++;
            MoveToNextSurvey();
        }
        else if ($scope.currentSurveyType == _SurveyType.PHQ9 && key == 'SuicidalThoughts' && value > 0) {
            //$("#PHQ9Question10").modal("show");
            await MoveToNextQuestion();
        }
        else
            await MoveToNextQuestion();
        _tempKey = null;
        _tempValue = null;

        if (key != '') {
            nextStep();
        }

    }

    var nextStep = function () {
        if ($scope.currentStep < $scope.totalSteps) {
            $scope.currentStep++;
            $scope.progress = ($scope.currentStep / $scope.totalSteps) * 100;
        }
    };

    var prevStep = function () {
        $scope.blockVisible = false;
        $('label.active').removeClass('active');
        if ($scope.currentStep > 0) {
            $scope.currentStep--;
            $scope.progress = ($scope.currentStep / $scope.totalSteps) * 100;
        }
    };

    var userSelectedSurveys = [];
    $scope.AddRemoveSurvey = function (surveyData) {
        var surveyID = surveyData.SurveyID;
        var NoneOftheseSurveyID = -1
        if (surveyID == NoneOftheseSurveyID) //None of these option
        {
            // if not already selected
            if (userSelectedSurveys.indexOf(NoneOftheseSurveyID) < 0) {
                userSelectedSurveys = [];
                angular.forEach($scope.AdditionalSurveys, function (value, index) {
                    value.IsActive = false;
                });
            }
        }
        else {
            if (userSelectedSurveys.indexOf(NoneOftheseSurveyID) >= 0) {
                userSelectedSurveys.splice(userSelectedSurveys.indexOf(NoneOftheseSurveyID), 1);
                angular.forEach($scope.AdditionalSurveys, function (value, index) {
                    if (NoneOftheseSurveyID == value.SurveyID)
                        value.IsActive = false;
                });
            }
        }
        if (userSelectedSurveys.indexOf(surveyID) < 0) {
            if (surveyID != NoneOftheseSurveyID)
                SecondaryQuestionniareClicked(surveyID);
            userSelectedSurveys.push(surveyID);
            surveyData.IsActive = true;
        }
        else {
            userSelectedSurveys.splice(userSelectedSurveys.indexOf(surveyID), 1);
            surveyData.IsActive = false;
        }
    }
    $scope.GetStarted = function () {
        $scope.currentSurveyType = _SurveyType.PHQ9;
    }

    $scope.MoveToSurveys = function () {

        //Reset progress bar
        $scope.progressBarCurrentQuestion = 0;
        $scope.progressBarMaxQuestion = 0;

        //Calculate progress bar steps for additional surveys
        for (var i = 0; i < userSelectedSurveys.length; i++) {
            if (userSelectedSurveys[i] > 0) {
                _CurrentSurveys.push(userSelectedSurveys[i]);
                $scope.progressBarMaxQuestion += GetMaxQuestionCountBySurveyType(userSelectedSurveys[i]);
            }
        }
        $scope.progressBarMaxQuestion -= 1;
        _CurrentSurveys.push(_SurveyType.DemographicQuestions);
        _CurrentSurveys.push(_SurveyType.Feedback);
        if ($scope.ratherAnswer == true)
            SaveIsSkip(false, function () { MoveToNextSurvey(); });
        else
            MoveToNextSurvey();
    }

    $scope.SaveFeedbackSurveyData = function () {
        var Feedback = {
            UsefulInformation: $scope.FDB.Q1,
            SpeaktoGP: $scope.FDB.Q2,
            Likelytouseonlineresources: $scope.FDB.Q3,
            HelpfromHealthProfessional: $scope.FDB.Q4,
            UserID: $scope.UserID,

        }
        apiCallsFactory.SaveFeedback(Feedback).then(function (data) {
            $scope.ShowFeedbackSurvey = false;
        });
    }
    $scope.SaveFeedbackUserSurveyData = function () {
        var FeedbackUser = {
            FirstName: $scope.FDBU.FirstName,
            Email: $scope.FDBU.Email,
            ID: $scope.UserID
        }
        apiCallsFactory.UpdateUserData(FeedbackUser).then(function (data) {
            $scope.ShowUserDetailForm = false;
        });
    }
    function GetCurrentSurveyString() {

        var data = '';
        for (var i = 0; i < _CurrentSurveys.length; i++) {
            if (_CurrentSurveys[i] == _SurveyType.PHQ9 || _CurrentSurveys[i] == _SurveyType.GAD7 || _CurrentSurveys[i] == _SurveyType.PTSD)
                data += _CurrentSurveys[i] + ",";
        }
        if (data != '')
            data = data.substring(0, data.length - 1);
        return data;
    }
    $scope.ViewReport = function () {

        $scope.IsViewReport = true;
        $scope.ReportViewed = true;
        $scope.ShowFeedbackSurvey = true;

        apiCallsFactory.PushDataToGTM({
            'event': 'questionnaire-event',
            'questionnaireEvent': 'view-report-clicked',
            'questionnaireCategory': 'bushfire',
            'questionnaireName': '',
            'questionnaireSecondaryName': ''
        });
        /*window.open('/Report/ViewFile?userID=' + $scope.UserGUID + "&currentSurveys=" + GetCurrentSurveyString())*/
        /* window.open('/Report?userID=' + $scope.UserGUID + "&currentSurveys=" + GetCurrentSurveyString())*/

        window.location.href = '/Report?userID=' + $scope.UserGUID + "&currentSurveys=" + GetCurrentSurveyString();

        /*window.location.href = '/Report?userID=' + $scope.UserGUID + "&currentSurveys=" + GetCurrentSurveyString();*/

        //location.reload('/Report/ViewFile?userID=' + $scope.UserGUID + "&currentSurveys=" + GetCurrentSurveyString())


    }

  
    $scope.ShowFeedbackSurveyfn = function () {
        $scope.ShowFeedbackSurvey = true;
    }
    $scope.DownloadReport = function () {

        $scope.IsViewReport = true;
        $scope.ReportViewed = true;
        $scope.ShowFeedbackSurvey = true;
        apiCallsFactory.PushDataToGTM({
            'event': 'questionnaire-event',
            'questionnaireEvent': 'download-report-clicked',
            'questionnaireCategory': 'bushfire',
            'questionnaireName': '',
            'questionnaireSecondaryName': ''
        });
        window.open('/Report/DownloadFile?userID=' + $scope.UserGUID + "&currentSurveys=" + GetCurrentSurveyString(), 'ViewReport')
    }
    //$scope.SendEmailReportfn = function () {
    //    $scope.ReportViewed = true;
    //    $scope.ShowFeedbackSurvey = true;
    //}

    function ValidateEmailForm() {

        $('#emailErrorMessage').text('');

        var isValid = true;
        $scope.InValidEmail = false;

        if ($scope.Report.Email == null || $scope.Report.Email == "") {
            $scope.EmailError = true;
            $scope.InValidEmail = true;
            var errorMessage = "Please enter your email address.";
            $('#emailError').show();
            $('#emailErrorMessage').text(errorMessage);
            emailInput.addClass('error-border');
            isValid = false;
        } else {
            $scope.EmailError = false;
            if (!validateEmail($scope.Report.Email)) {
                $scope.InValidEmail = true;
                isValid = false;
            } else {
                $scope.InValidEmail = false;
            }

        }

        var emailInput = $('#txtEmail');
        var emailValue = emailInput.val();
        if ($scope.Report.Email != null && emailValue.indexOf('@') === -1) {

            var errorMessage = "Please include an ‘@’ in the email address.";
            $('#emailError').show();
            $('#emailErrorMessage').text(errorMessage);
            emailInput.addClass('error-border');
            return;

        }
        // else if ($scope.Report.Email != null && emailValue.indexOf('@gmail.com') === -1) {
        //    var errorMessage = "Please include a domain i.e. ‘@gmail.com’.";
        //    $('#emailError').show();
        //    $('#emailErrorMessage').text(errorMessage);
        //    emailInput.addClass('error-border');
        //    return;
        //}
        else if ($scope.Report.Email != null) {
            debbugger
            $scope.InValidEmail = false;
            var emailPattern = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,6}$/;
            if (!emailPattern.test(emailValue)) {

                var errorMessage = "Please enter a valid email address.";

                $('#emailError').show();
                $('#emailErrorMessage').text(errorMessage);
                emailInput.addClass('error-border');
                return;
            }


        }
        //if (!domainPattern.test(parts[1])) {
        //    var errorMessage = "Please include a domain i.e. ‘@gmail.com’";
        //    $('#emailError').show();
        //    $('#emailErrorMessage').text(errorMessage);
        //    emailInput.addClass('error-border');
        //    return;
        //}

        else {
            $('#emailError').hide();
            $('#emailErrorMessage').text('');
            emailInput.removeClass('error-border');
        }



        return isValid;
    }
    function validationforemail(emailValue) {

        if (emailValue.indexOf('@') === -1) {
            var errorMessage = "Please include '@' in the email address.";
            // Show error message if '@' is missing
            $('#emailError').show();
            $('#emailErrorMessage').text(errorMessage);
            emailInput.addClass('error-border');

        }
    }
    $('#txtEmail').on('input blur', function () {
        validateEmail();
    });
    // Example validation function
    function validateEmail(email) {
        var re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        return re.test(email);
    }


    $scope.SendEmailReport = function () {
        if (ValidateEmailForm()) {
            $scope.isLoading = true;
            $scope.IsViewReport = true;
            $scope.EmailSent = false;
            $scope.ReportViewed = true;
            $scope.ShowFeedbackSurvey = true;

            apiCallsFactory.PushDataToGTM({
                'event': 'questionnaire-event',
                'questionnaireEvent': 'email-report-clicked',
                'questionnaireCategory': 'bushfire',
                'questionnaireName': '',
                'questionnaireSecondaryName': ''
            });
            const urlParams = new URLSearchParams(window.location.search);
            var SendEmail = {

                userID: urlParams.get('userID'),
                currentSurveys: GetCurrentSurveyString(),
                Name: $scope.Report.Name,
                Email: $scope.Report.Email,
                IsREIntegration: $scope.Report.IsREIntegration,
                ID: $scope.UserID
            }
            //
            $scope.dynamicHtml = '';
            apiCallsFactory.SendEmailReport(SendEmail).then(function (data) {
                handleSurveyResponse(data, function () {
                    $scope.FDBU.FirstName = $scope.Report.Name;
                    $scope.FDBU.Email = $scope.Report.Email;
                    EmailSentSuccessfully();
                    $scope.isLoading = false;

                    $scope.reportSubmited = true;


                });
            }, handleSurveyErrorCallback);


            //window.open('/Report/ViewFile?userID=' + $scope.UserGUID + "&currentSurveys=" + GetCurrentSurveyString(), "_blank");
        }
    }


    //Internal menthods starts

    function PushSurveyNameInGTM(SurveyID) {

        apiCallsFactory.PushDataToGTM({
            'event': 'questionnaire-event',
            'questionnaireEvent': 'loaded',
            'questionnaireCategory': 'bushfire',
            'questionnaireName': getQuestionnaireNameForGTM(SurveyID), //insert primary questionnaire name
            'questionnaireSecondaryName': '' //insert secondary questionnaire name if relevant, or pass blank
        });
    }

    function PushAnswerQuestionDataInGTM(value, category, questionNumber) {
        apiCallsFactory.PushDataToGTM({
            'event': 'questionnaire-event',
            'questionnaireEvent': 'question-answered',
            'questionNumber': questionNumber, // [integer] insert question number
            'questionnaireCategory': category, //insert 'clinic', 'self-test' or other quiz category
            'questionnaireName': getQuestionnaireNameForGTM($scope.currentSurveyType), //insert primary questionnaire name
            'questionnaireSecondaryName': '' //insert secondary questionnaire name if relevant, or pass blank

        });
    }
    function PushPreviousQuestionDataInGTM(category, questionNumber) {
        apiCallsFactory.PushDataToGTM({
            'event': 'questionnaire-event',
            'questionnaireEvent': 'back',
            'questionNumber': questionNumber, // [integer] insert question number
            'questionnaireCategory': 'bushfire', //insert 'clinic', 'self-test' or other quiz category
            'questionnaireName': getQuestionnaireNameForGTM($scope.currentSurveyType), //insert primary questionnaire name
            'questionnaireSecondaryName': '' //insert secondary questionnaire name if relevant, or pass blank

        });
    }
    function PushQuestionAnswersStarted(event) {
        apiCallsFactory.PushDataToGTM({
            'event': 'questionnaire-event',
            'questionnaireEvent': event,
            'questionnaireCategory': 'bushfire',
            'questionnaireName': getQuestionnaireNameForGTM($scope.currentSurveyType), //insert primary questionnaire name
            'questionnaireSecondaryName': '' //insert secondary questionnaire name if relevant, or pass blank

        });
    }

    function PushAllQuestionAnswersForQuestionnaire(event) {
        apiCallsFactory.PushDataToGTM({
            'event': 'questionnaire-event',
            'questionnaireEvent': event,
            'questionnaireCategory': 'bushfire',
            'questionnaireName': getQuestionnaireNameForGTM($scope.currentSurveyType), //insert primary questionnaire name
            'questionnaireSecondaryName': '' //insert secondary questionnaire name if relevant, or pass blank
        });
    }

    function SecondaryQuestionniareClicked(surveyTypeID) {
        apiCallsFactory.PushDataToGTM({
            'event': 'questionnaire-event',
            'questionnaireEvent': 'secondary-questionnaire-clicked',
            'questionnaireCategory': 'bushfire',
            'questionnaireName': getQuestionnaireNameForGTM(surveyTypeID),
            'questionnaireSecondaryName': ''
        });
    }


    function getQuestionnaireNameForGTM(SurveyID) {
        return GetSurveyNameBySurveyID(SurveyID).SurveyName.toLowerCase().replace(/ /g, '-')
    }


    function GetSurveyNameBySurveyID(surveyID) {
        var surveydata = undefined;
        angular.forEach(_SurveyNames, function (value, index) {
            if (surveyID == value.SurveyTypeID)
                surveydata = value;
        });
        return surveydata;
    }

    function SaveSurveyResponse(key, value, callack) {
        var total = null;
        if ($scope.currentSurveyType == _SurveyType.DemographicQuestions) {
            $scope.isLoading = true;
            apiCallsFactory.RegisterUser().then(function (data) {
                $scope.UserID = data.data.UserID;
                $scope.UserGUID = data.data.UserGUID;

                if ($scope.currentSurveyType == _SurveyType.DemographicQuestions) {
                    $scope.SaveDemographicPage0();
                }

                $scope.isLoading = false;
                MoveToNextSurvey();
            });


        }
        else if ($scope.currentSurveyType == _SurveyType.PHQ9) {
            SavePHQ9SurveyData(key, value, total, callack);
        }
        else if ($scope.currentSurveyType == _SurveyType.GAD7) {
            if ($scope.currentQuestion == _MaxSurveyQuestions.GAD7) {
                total = SumGAD7Survey();
            }

            SaveGAD7SurveyData(key, value, total, callack);
        }
        else if ($scope.currentSurveyType == _SurveyType.AUDIT) {
            if ($scope.currentQuestion == _MaxSurveyQuestions.AUDIT) {
                total = SumAUDITSurvey();
            }

            SaveAUDITSurveyData(key, value, total, callack);
        }
        else if ($scope.currentSurveyType == _SurveyType.PTSD) {
            if ($scope.currentQuestion == _MaxSurveyQuestions.PTSD) {
                total = SumPTSDSurvey();
            }

            SavePTSDSurveyData(key, value, total, callack);
        }
    }

    function SumPHQ9Survey() {
        var total = 0;
        total += parseInt($scope.PHQ9.Q1);
        total += parseInt($scope.PHQ9.Q2);
        total += parseInt($scope.PHQ9.Q3);
        total += parseInt($scope.PHQ9.Q4);
        total += parseInt($scope.PHQ9.Q5);
        total += parseInt($scope.PHQ9.Q6);
        total += parseInt($scope.PHQ9.Q7);
        total += parseInt($scope.PHQ9.Q8);
        total += parseInt($scope.PHQ9.Q9);
        return total;
    }

    function SavePHQ9SurveyData(key, value, total, callack) {
        var PHQ9 = {
            LittleInterest: null,
            Depressed: null,
            TroubleSleeping: null,
            FeelingTired: null,
            PoorAppetite: null,
            FeelingBad: null,
            TroubleConcentrating: null,
            MovingSlowly: null,
            SuicidalThoughts: null,
            UserID: $scope.UserID,
            Total: total
        }
        PHQ9[key] = value;
        apiCallsFactory.SavePHQ9(PHQ9).then(function (data) {
            handleSurveyResponse(data, callack, key, value);
        }, handleSurveyErrorCallback);
    }

    function DeselectSurveyQuestion() {
        var element = $("input[type=radio]:visible:checked");
        element.prop("checked", false);
        var _scope = angular.element(element[0]).scope();
        var ngModel = element.attr('ng-model');
        ngModel = ngModel.split(".");
        _scope[ngModel[0]][ngModel[1]] = 0;
    }

    function handleSurveyErrorCallback() {
        try {
            DeselectSurveyQuestion();
        } catch (e) {
            // avoid expection
        }
        alert("Please try again");
        $scope.isDataPostIsInProgress = false;
    }
    function handleSurveyResponse(data, callack, key, value) {

        $scope.isDataPostIsInProgress = false;
        if (data != null && data.data != null && data.data.isSuccess) {
            if (callack)
                callack(key, value, data);
        }
        else {
            handleSurveyErrorCallback();
        }
    }

    function SumGAD7Survey() {
        var total = 0;
        total += parseInt($scope.GAD7.Q1);
        total += parseInt($scope.GAD7.Q2);
        total += parseInt($scope.GAD7.Q3);
        total += parseInt($scope.GAD7.Q4);
        total += parseInt($scope.GAD7.Q5);
        total += parseInt($scope.GAD7.Q6);
        total += parseInt($scope.GAD7.Q7);
        return total;
    }

    function SaveGAD7SurveyData(key, value, total, callack) {
        var GAD7 = {
            Anxious: null,
            ControlWorry: null,
            WorryTooMuch: null,
            TroubleRelaxing: null,
            Restless: null,
            Annoyed: null,
            Afraid: null,
            UserID: $scope.UserID,
            Total: total
        }
        GAD7[key] = value;
        apiCallsFactory.SaveGAD7(GAD7).then(function (data) {
            handleSurveyResponse(data, callack, key, value);
        }, handleSurveyErrorCallback);
    }
    function SavePTSDSurveyData(key, value, total, callack) {
        var PTSD = {
            Q1: null,
            Q2: null,
            Q3: null,
            Q4: null,
            UserID: $scope.UserID,
            Total: total
        }
        PTSD[key] = value;
        apiCallsFactory.SavePTSD(PTSD).then(function (data) {
            handleSurveyResponse(data, callack, key, value);
        }, handleSurveyErrorCallback);
    }

    function SumPTSDSurvey() {
        var total = 0;
        total += parseInt($scope.PTSD.Memories);
        total += parseInt($scope.PTSD.HappeningAgain);
        total += parseInt($scope.PTSD.Nightmares);
        total += parseInt($scope.PTSD.EmotionalReactions);
        total += parseInt($scope.PTSD.AvoidingActivities);
        total += parseInt($scope.PTSD.AvoidingThoughts);
        total += parseInt($scope.PTSD.Jumpy);
        total += parseInt($scope.PTSD.OnGuard);
        return total;
    }

    function SaveAUDITSurveyData(key, value, total, callack) {
        var AUDIT = {
            Q1: null,
            Q2: null,
            Q3: null,
            Q4: null,
            Q5: null,
            Q6: null,
            Q7: null,
            Q8: null,
            Q9: null,
            Q10: null,
            Q11: null,
            UserID: $scope.UserID,
            Total: total
        }
        AUDIT[key] = value;
        apiCallsFactory.SaveAUDIT(AUDIT).then(function (data) {
            handleSurveyResponse(data, callack, key, value);
        }, handleSurveyErrorCallback);
    }
    function SumAUDITSurvey() {
        var total = 0;
        total += parseInt($scope.AUDIT.Q1);
        total += parseInt($scope.AUDIT.Q2);
        total += parseInt($scope.AUDIT.Q3);
        total += parseInt($scope.AUDIT.Q4);
        total += parseInt($scope.AUDIT.Q5);
        total += parseInt($scope.AUDIT.Q6);
        total += parseInt($scope.AUDIT.Q7);
        total += parseInt($scope.AUDIT.Q8);
        total += parseInt($scope.AUDIT.Q9);
        total += parseInt($scope.AUDIT.Q10);
        return total;
    }

    async function MoveToNextQuestion() {

        $scope.progressBarCurrentQuestion++;
        if (($scope.currentSurveyType == _SurveyType.PHQ9 && $scope.currentQuestion != 9 && $scope.currentQuestion != 10) || $scope.currentSurveyType == _SurveyType.GAD7 || $scope.currentSurveyType == _SurveyType.PTSD) {
            $scope.isDataPostIsInProgress = true;

            setTimeout(function () { move(true); }, 0);
        }
        else
            move(false);


    }
    function move(changeDataPostIsInProgress) {
        if (changeDataPostIsInProgress)
            $scope.isDataPostIsInProgress = false;

        var MaxQuestion = GetMaxQuestionCountBySurveyType($scope.currentSurveyType);

        if ($scope.currentQuestion < MaxQuestion) {
            $scope.currentQuestion++;

            if (changeDataPostIsInProgress)
                $scope.$apply();

            if ($scope.currentQuestion == 8) {
                setTimeout(() => {
                    scrollTraumaIfNotCentered();
                }, 100);
            }

        } else {
            MoveToNextSurvey();

            if (changeDataPostIsInProgress)
                $scope.$apply();

            if ($scope.currentSurveyType == 9) {
                NewSaveFeedbackPart1SurveyData();
            }
        }
    }

    function scrollTraumaIfNotCentered() {
        const el = document.querySelector('.traumaQuestions');
        if (!el) return;

        const rect = el.getBoundingClientRect();
        const elCenter = rect.top + rect.height / 2;
        const viewportCenter = window.innerHeight / 2;

        const threshold = 40;

        if (Math.abs(elCenter - viewportCenter) > threshold) {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const targetY = rect.top + scrollTop - viewportCenter + rect.height / 2;

            window.scrollTo({
                top: targetY,
                behavior: 'smooth'
            });
        }
    }

    function MoveToPreviousQuestion(progressBarCurrentQuestion, currentQuestion) {
        var MaxQuestion = GetMaxQuestionCountBySurveyType($scope.currentSurveyType);
        PushPreviousQuestionDataInGTM('clinic', $scope.currentQuestion);
        DeselectQuestionAnswer();

    }

    function MoveToNextSurvey() {

        if ($scope.currentSurveyType == _SurveyType.LandingPage) {
            PushQuestionAnswersStarted('started');
        }

        $scope.currentSurveyIndex++;

        if ($scope.currentSurveyIndex <= _CurrentSurveys.length) {
            $scope.currentSurveyType = _CurrentSurveys[$scope.currentSurveyIndex - 1];
            $scope.currentQuestion = 1;
            if ($scope.currentSurveyType != _SurveyType.Feedback && $scope.currentSurveyType != _SurveyType.FeedbackPart1 && $scope.currentSurveyType != _SurveyType.DemographicQuestions && $scope.currentSurveyType != _SurveyType.SurveyLandingPage)
                PushSurveyNameInGTM($scope.currentSurveyType);
        }

        if ($scope.currentSurveyType == _SurveyType.PHQ9) {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }

        if ($scope.currentSurveyType == _SurveyType.AUDIT || $scope.currentSurveyType == _SurveyType.DemographicQuestions) {
            window.scrollTo({
                top: 220,
                behavior: 'smooth',
            });
        }
        if ($scope.currentSurveyType == _SurveyType.PTSD) {
            window.scrollTo({
                top: 220,
                behavior: 'smooth',
            });
        }

    }
    $scope.MoveUserToPreviousStep = function () {
        if ($scope.currentQuestion > 1) {
            $scope.currentQuestion--;
            $scope.updateCurrentQuestion(); // 🟢 Important

            PushAnswerQuestionDataInGTM('back', 'bushfire', $scope.currentQuestion);

            if ($scope.currentQuestion == 1) {
                var event = 'restarted';
                if (userSelectedSurveys.indexOf($scope.currentSurveyType) >= 0)
                    event = 'secondary-questionnaire-restarted';
                PushQuestionAnswersStarted(event);
            }
            ResetUserResponse();


        }
    };

    function GetMaxQuestionCountBySurveyType(surveyTypeID) {
        switch (surveyTypeID) {
            case _SurveyType.PHQ9:
                return _MaxSurveyQuestions.PHQ9;
            case _SurveyType.GAD7:
                return _MaxSurveyQuestions.GAD7;
            case _SurveyType.AUDIT:
                return _MaxSurveyQuestions.AUDIT;
            case _SurveyType.PTSD:
                return _MaxSurveyQuestions.PTSD;

        }
    }

    $scope.SaveDemographicQuestionsAndSurveyData = function () {
        var validate = true;
        if (validateDemographicSurvey())
            SaveDemographicQuestionsSurveyData(true);
        return validate;
    };

    $scope.ClearDescribeMeLayer1Selection = function () {
        $scope.DemographicQuestions.DescribeMeLayer2ID = null;
        $scope.DemographicQuestions.DescribeMeOther = "";
    };


    var validateDemographicSurvey = function () {
        var isValid = true;

        if ($scope.DemographicQuestions.DescribeMeLayer1ID == null) {
            $scope.msgDescribeMe1ID = "*Please select what best describes you";
            isValid = false;
        }
        else {
            $scope.msgDescribeMe1ID = "";

            if ($scope.DemographicQuestions.DescribeMeLayer1ID == "1" || $scope.DemographicQuestions.DescribeMeLayer1ID == "2") {
                if ($scope.DemographicQuestions.DescribeMeLayer2ID == null) {
                    $scope.msgDescribeMe1ID = "*Please select what best describes you";
                    isValid = false;
                }
                else {
                    $scope.msgDescribeMe1ID = "";
                }
            }
            else if ($scope.DemographicQuestions.DescribeMeLayer1ID == "3") {
                if ($scope.DemographicQuestions.DescribeMeOther == null || $scope.DemographicQuestions.DescribeMeOther == "") {
                    $scope.msgDescribeMe1ID = "*Please select what best describes you";
                    isValid = false;
                }
                else
                    $scope.msgDescribeMe1ID = "";

            }

        }

        if ($scope.DemographicQuestions.Age == "0") {
            $scope.msgAge = "*Please select age";
            isValid = false;
        }
        else
            $scope.msgAge = "";

        if ($scope.DemographicQuestions.Gender == "0") {
            $scope.msgGender = "*Please select gender";
            isValid = false;
        }
        else
            $scope.msgGender = "";

        if ($scope.DemographicQuestions.Postcode == null ||
            $scope.DemographicQuestions.Postcode == undefined ||
            $scope.DemographicQuestions.Postcode == "") {
            $scope.msgPostCode = "*Please enter post code";
            isValid = false;
        }
        else
            $scope.msgPostCode = "";


        if ($scope.DemographicQuestions.IsSeenDoctor == null) {
            $scope.HealthcareWorkerError = "*Please select response";
            isValid = false;
        }
        else
            $scope.HealthcareWorkerError = "";

        if (!checkCheckBoxChecked($scope.DemographicQuestions.VisitingTailored)
            && !checkCheckBoxChecked($scope.DemographicQuestions.VisitingInformation)
            && !checkCheckBoxChecked($scope.DemographicQuestions.VisitingEncouragement)
            && !checkCheckBoxChecked($scope.DemographicQuestions.VisitingInformationConcern)
            && !checkCheckBoxChecked($scope.DemographicQuestions.VisitingSeeing)
            && !checkCheckBoxChecked($scope.DemographicQuestions.VisitingOthers)
        ) {
            $scope.msgReceiveBushFireFrom = "*Please select response.";
            isValid = false;
        }
        else {
            $scope.msgReceiveBushFireFrom = "";

            if (checkCheckBoxChecked($scope.DemographicQuestions.VisitingOthers)) {
                if ($scope.DemographicQuestions.VisitingOthersText == null ||
                    $scope.DemographicQuestions.VisitingOthersText == undefined ||
                    $scope.DemographicQuestions.VisitingOthersText == "") {
                    $scope.msgReceiveBushFireFrom = "*Please select response";
                    isValid = false;
                }
                else
                    $scope.msgReceiveBushFireFrom = "";
            }
        }
        if (!checkCheckBoxChecked($scope.DemographicQuestions.ServiceFace)
            && !checkCheckBoxChecked($scope.DemographicQuestions.ServiceDigital)
            && !checkCheckBoxChecked($scope.DemographicQuestions.ServiceInformation)
            && !checkCheckBoxChecked($scope.DemographicQuestions.ServiceMood)
            && !checkCheckBoxChecked($scope.DemographicQuestions.ServiceOther)
        ) {
            $scope.msgServiceError = "*Please select response";
            isValid = false;
        }
        else {
            $scope.msgServiceError = "";
            if (checkCheckBoxChecked($scope.DemographicQuestions.ServiceOther)) {
                if ($scope.DemographicQuestions.ServiceOtherText == null ||
                    $scope.DemographicQuestions.ServiceOtherText == undefined ||
                    $scope.DemographicQuestions.ServiceOtherText == "") {
                    $scope.msgServiceError = "*Please select response";
                    isValid = false;
                }
                else
                    $scope.msgServiceError = "";
            }
        }
        return isValid;
    };

    $scope.clearVisitingOther = function () {
        $scope.DemographicQuestions.VisitingOthersText = null;
    };

    $scope.StateChange = function () {
        $scope.DemographicQuestions.DescribeMeLayer2ID = null;
        $scope.DemographicQuestions.IsVolunteer = null;
        $scope.processDescribeMeDetail({ ID: 0 });
    }


    $scope.clearServiceOther = function () {
        $scope.DemographicQuestions.ServiceOtherText = null;
    };
    var checkCheckBoxChecked = function (value) {
        return !(value == null || value == false);
    };

    SaveDemographicQuestionsSurveyData = function (moveToNext) {
        apiCallsFactory.SaveDemographicQuestions(GetDemographicSurveyData()).then(function (data) {
            handleSurveyResponse(data, function (a, i, data) {
                if (moveToNext) {
                    $scope.UserID = data.data.UserID;
                    $scope.UserGUID = data.data.UserGUID;
                    MoveToNextSurvey();
                }

            });
        }, handleSurveyErrorCallback);

    };

    var GetDemographicSurveyData = function () {
        var data = {};
        data.ID = $scope.UserID;


        if ($scope.currentPageNo == 0) {
            data.AgeID = parseInt($scope.DemographicQuestions.Age);
            data.GenderID = parseInt($scope.DemographicQuestions.Gender);
            data.StateID = $scope.DemographicQuestions.StateID;
            data.User_indigenous_identity = $scope.DemographicQuestions.User_indigenous_identity;
            data.IsSeenDoctor = parseInt($scope.DemographicQuestions.IsSeenDoctor);
            data.RoleAtEWS = parseInt($scope.DemographicQuestions.RoleAtEWS);
            data.RoleAtEWSChecks = $scope.selectedRoleIds;
            data.ExperienceRoleChecks = $scope.selectedExperienceIds;
            data.KnowUsRoleAtAWSChecks = $scope.selectedKnowUsIds;
            data.RoleAtServiceChecks = $scope.selectedServiceRoleIds;

            //=====================28feb========================
            data.RoleAtProfession = parseInt($scope.DemographicQuestions.RoleAtProfession);
            data.OtherRoleAtProfession = $scope.DemographicQuestions.OtherRoleAtProfession;
            //===============================================
            data.OtherRoleAtEWS = $scope.DemographicQuestions.OtherRoleAtEWS;
            data.OtherRoleAtService = $scope.DemographicQuestions.OtherRoleAtService;
            data.ExperienceOtherRole = $scope.DemographicQuestions.ExperienceOtherRole;
        }


        if ($scope.currentPageNo == 1) {
            data.StateID = $scope.DemographicQuestions.StateID;
            data.IsVolunteer = $scope.DemographicQuestions.IsVolunteer;
            data.DescribeMeInDetailID = $scope.DemographicQuestions.DescribeMeLayer2ID;
            if (data.DescribeMeInDetailID == $scope.DescribeMeInDetailItems.Other)
                data.DescribeMeOther = $scope.DemographicQuestions.DescribeMeOther;
        }
        if ($scope.currentPageNo == 2) {
            data.IsSeenDoctor = parseInt($scope.DemographicQuestions.IsSeenDoctor);
            data.IsBushFireAffectedHealth = parseInt($scope.DemographicQuestions.IsBushFireAffectedHealth);
            data.SeekingHelpAnswersBushFire = [];
            for (var i = 0; i < $scope.ProcessMentalHealthList.length; i++) {
                data.SeekingHelpAnswersBushFire.push(getSeekingHelpObj($scope.ProcessMentalHealthList[i], data.ID, null));
            }
            if ($scope.DemographicQuestions.MentalHealthOther != null) {
                data.SeekingHelpAnswersBushFire.push(getSeekingHelpObj(6, data.ID, $scope.DemographicQuestions.MentalHealthOther));
            }
            data.BushfireAffectedYear = [];
            for (var i = 0; i < $scope.ProcessBushfireSeasonsList.length; i++) {
                data.BushfireAffectedYear.push(getBushFireSeasonObj($scope.ProcessBushfireSeasonsList[i], data.ID));
            }
        }
        if ($scope.currentPageNo == 3) {
            data.GenderID = parseInt($scope.DemographicQuestions.Gender);
            data.AgeID = parseInt($scope.DemographicQuestions.Age);

            var _tempPostcode = $scope.DemographicQuestions.Postcode;

            _tempPostcode = _tempPostcode.split(',');
            var suburb = _tempPostcode[0];

            var _state = _tempPostcode[1].trim().split(" ")[0];

            if (_state.length > 2)
                data.PostCode = _tempPostcode[1].trim().split(" ")[1];
            else
                data.PostCode = _tempPostcode[1].trim().split(" ")[2];

            data.Suburb = suburb;
            data.Email = $scope.DemographicQuestions.Email;
            //data.MobileNumber = $scope.DemographicQuestions.Mobile;
            if ($scope.DemographicQuestions.Email != null/* || $scope.DemographicQuestions.Mobile != null*/)
                data.FutureResearchConsent = "1";
            else
                data.FutureResearchConsent = "0";
            $scope.Report.Email = $scope.DemographicQuestions.Email;
        }
        return data;
    };

    var getBushFireSeasonObj = function (value, userID) {
        return {
            UserID: userID,
            BushFireSeasonID: value
        };
    };


    var getSeekingHelpObj = function (value, userID, other) {
        return {
            UserID: userID,
            SeekingHelpOptionsBushFireID: value,
            Other: other
        };
    };


    $scope.RatherNotAnswer = function () {
        SaveIsSkip(true, function () { MoveToNextSurvey(); });
    }
    $scope.ClearData = function () {
        if ($scope.DemographicQuestions.Q1 == "No")
            $scope.DemographicQuestions.Q2 = null;
    }

    $scope.ClearBushfireImpacted = function () {
        if ($scope.DemographicQuestions.BushfireDistressed == "No") {
            $scope.DemographicQuestions.BushfireImpacted = null;
            $scope.BushfireImpactedError = '';
        }
    }
    function SaveIsSkip(_isSkip, callback) {
        var DemographicQuestions = {
            IsSkip: _isSkip,
            ID: $scope.UserID,
        }
        apiCallsFactory.SaveDemographicQuestions(DemographicQuestions).then(function (data) {
            handleSurveyResponse(data, callback);
        }, handleSurveyErrorCallback);;
    }

    $scope.ResetUserResponse = function (key, value) {

        if (!$scope.isDataPostIsInProgress) {
            $scope.isDataPostIsInProgress = true;
            $scope.isBackButton = true;
            ResetUserResponseSurveyData();
            prevStep();

        }
    }

    ResetUserResponseSurveyData = function () {
        var surveyQuestionMapping = [
            [],
            [],
            ['LittleInterest', 'Depressed', 'TroubleSleeping', 'FeelingTired', 'PoorAppetite', 'FeelingBad', 'TroubleConcentrating', 'MovingSlowly', 'SuicidalThoughts'],
            ['Anxious', 'ControlWorry', 'WorryTooMuch', 'TroubleRelaxing', 'Restless', 'Annoyed', 'Afraid'],
            ['Memories', 'HappeningAgain', 'Nightmares', 'EmotionalReactions', 'AvoidingActivities', 'AvoidingThoughts', 'Jumpy', 'OnGuard'],
            ['Q1', 'Q2', 'Q3', 'Q4', 'Q5', 'Q6', 'Q7', 'Q8', 'Q9', 'Q10']
        ];


        if ($scope.currentSurveyType == _SurveyType.AUDIT && $scope.currentQuestion == 9 && $scope.AUDIT.Q1 == 0) {
            currentQuestionName = surveyQuestionMapping[$scope.currentSurveyType - 1][$scope.currentQuestion - 9];
            $scope.progressBarCurrentQuestion -= 8;
            $scope.currentQuestion -= 8;
        }
        else if ($scope.currentSurveyType == _SurveyType.AUDIT && $scope.currentQuestion == 9 && $scope.AUDIT.Q2 == 0 && $scope.AUDIT.Q3 == 0) {
            currentQuestionName = surveyQuestionMapping[$scope.currentSurveyType - 1][$scope.currentQuestion - 7];
            $scope.progressBarCurrentQuestion -= 6;
            $scope.currentQuestion -= 6;
        }
        else {
            var currentQuestionName = surveyQuestionMapping[$scope.currentSurveyType - 1][$scope.currentQuestion - 2];
            $scope.progressBarCurrentQuestion--;
            $scope.currentQuestion--;
        }

        var ResetUserResponse = {
            UserID: $scope.UserID,
            currentSurveyType: $scope.currentSurveyType,
            currentQuestion: currentQuestionName
        }
        apiCallsFactory.ResetUserResponse(ResetUserResponse).then(function (data) {
            handleSurveyResponse(data, function () { MoveToPreviousQuestion(); });
        }, handleSurveyErrorCallback);

    }
    $scope.ClearTextBoxAttribute = function () {

        $scope.DemographicQuestions.OtherRoleAtEWS = null;


    }

    //$scope.onRoleSelect = function (roleValue) {
    //    $scope.DemographicQuestions.OtherRoleAtEWS = null;
    //    $scope.RoleAtEWSChecks.RoleAtEWSChecksValues = {};
    //    $scope.RoleAtEWSChecks.RoleAtEWSChecksValues[roleValue] = {};
    //    $scope.ClearTextBoxAttribute();
    //};

    $scope.ClearTextBoxAttributeForRoleATProfessional = function () {
        $scope.DemographicQuestions.OtherRoleAtProfession = null;

    }

    $scope.selectedRoleIds = [];

    $scope.IsSelectRoleAtEWS = function (model) {
        const role = $scope.selectedRoleIds.find(function (r) {
            return r.roleId === model.RoleID;
        });
        if (role) {
            return true;
        }
        return false;
    };


    $scope.toggleRole = function (item, $event) {
        const element = $event.currentTarget;
        var ele = $(element).parent().parent();
        if (!item.selected) {
            $scope.selectedRoleIds.push({ roleId: item.RoleID, SubOptions: [] });

            if (ele.hasClass('itembackground-revers')) {
                ele.removeClass('itembackground-revers');
            }

        } else {
            const index = $scope.selectedRoleIds.findIndex(function (r) {
                return r.roleId === item.RoleID;
            });


            if (index > -1) {
                $scope.selectedRoleIds.splice(index, 1);
            }
            if (item.preferid == 'preferid') {

            }
            else {
                ele.addClass('itembackground-revers');
            }
        }

    };



    $scope.selectedServiceRoleIds = [];
    $scope.toggleServiceRole = function (item) {
        if (!item.selected) {
            $scope.selectedServiceRoleIds.push({ roleId: item.RoleID });
        } else {
            const index = $scope.selectedServiceRoleIds.findIndex(function (r) {
                return r.roleId === item.RoleID;
            });

            if (index > -1) {
                $scope.selectedServiceRoleIds.splice(index, 1);
            }
        }
    };


    $scope.selectedKnowUsIds = [];

    $scope.IsKnowUsSelectRoleAtEWS = function (model) {
        const role = $scope.selectedKnowUsIds.find(function (r) {
            return r.KnowUsRoleID === model.KnowUsRoleID;
        });
        if (role) {
            return true;
        }
        return false;
    };

    $scope.toggleKnowUsRole = function (item) {

        if (!item.selected) {
            $scope.selectedKnowUsIds.push({ KnowUsRoleID: item.KnowUsRoleID });

        } else {
            const index = $scope.selectedKnowUsIds.findIndex(function (r) {
                return r.KnowUsRoleID === item.KnowUsRoleID;
            });

            if (index > -1) {
                $scope.selectedKnowUsIds.splice(index, 1);
            }
        }
    };

    $scope.selectedExperienceIds = [];

    $scope.IsExperiencingSelectRoleAtEWS = function (model) {
        const role = $scope.selectedExperienceIds.find(function (r) {
            return r.ExperienceRoleID === model.ExperienceRoleID;
        });
        if (role) {
            return true;
        }
        return false;
    };

    $scope.toggleExperienceRole = function (item) {

        if (!item.selected) {
            $scope.selectedExperienceIds.push({ ExperienceRoleID: item.ExperienceRoleID });

        } else {
            const index = $scope.selectedExperienceIds.findIndex(function (r) {
                return r.ExperienceRoleID === item.ExperienceRoleID;
            });

            if (index > -1) {
                $scope.selectedExperienceIds.splice(index, 1);
            }
        }
    };

    $scope.toggleSubOption = function (subOptionItem, roleItem) {
        subOptionItem.isChecked = !subOptionItem.isChecked;

        const role = $scope.selectedRoleIds.find(function (r) {
            return r.roleId === roleItem.RoleID;
        });

        if (!role) return;

        const subOptions = role.SubOptions;

        if (!subOptionItem.selected) {

            const exists = subOptions.some(function (s) {
                return s.ID === subOptionItem.ID;
            });

            if (!exists) {
                subOptions.push({
                    ID: subOptionItem.ID
                });
            }
        } else {

            const index = subOptions.findIndex(function (s) {
                return s.ID === subOptionItem.ID;
            });

            if (index > -1) {
                subOptions.splice(index, 1);
            }
        }
    };
    $scope.$on('ngRepeatFinished', function () {
        $('[data-toggle="tooltip"]').tooltip();
    });
}]).directive("limitTo", [function () {
    return {
        restrict: "A",
        link: function (scope, elem, attrs) {
            var limit = parseInt(attrs.limitTo);
            angular.element(elem).on("keypress", function (e) {
                if (this.value.length >= limit) e.preventDefault();
            });
            angular.element(elem).on("keydown", function (e) {

                if (e.keyCode == 8) {
                    var _scope = angular.element(document.querySelectorAll("#pin")).scope();
                    _scope.clearPostCode();
                    _scope.$apply();
                }
            });
        }
    }
}]).directive('onFinishRender', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            if (scope.$last === true) {
                setTimeout(function () {
                    scope.$emit('ngRepeatFinished');
                }, 100);
            }
        }
    };
}).directive('tooltip', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            setTimeout(function () {
                $(element).tooltip({
                    html: true,
                    title: attrs.title,
                    trigger: 'manual',
                    placement: 'left',               // Align to the left
                    container: "#q5",  // Confine to parent div
                    boundary: 'clippingParents',     // Prevent escape
                    fallbackPlacements: []           // Prevent auto-flipping
                });

                let isTouchDevice = 'ontouchstart' in document.documentElement;

                if (isTouchDevice) {
                    $(element).on('click', function (e) {
                        e.stopPropagation();
                        $(element).tooltip('toggle');
                    });
                    $(document).on('click touchstart', function (e) {
                        if (!$(element).is(e.target) && $(element).has(e.target).length === 0) {
                            $(element).tooltip('hide');
                        }
                    });
                } else {
                    $(element).on('mouseenter', function () {
                        $(element).tooltip('show');
                    }).on('mouseleave', function () {
                        $(element).tooltip('hide');
                    });
                }
                // Cleanup on scope destroy
                scope.$on('$destroy', function () {
                    $(element).tooltip('dispose');
                });
            }, 10);
        }
    }
});

function EmailSentSuccessfully() {
    try {
        $('#Emailloadingmessage').css('display', 'none');
        var _scope = angular.element(document.querySelector("#questionController")).scope();
        $('#Emailsent').css('display', 'block');
        $('.sendemailbtn_new').css('display', 'none');
        $('#txtEmail').css('display', 'none');
        $('#email').css('display', 'none');
        var emailInput = $('#txtEmail').val();
        var emailValue = emailInput.val();
        $('#emailname').text(emailValue);
        if (_scope && typeof _scope.EmailSentSuccessfully === 'function') {
            _scope.EmailSentSuccessfully();
        } else {
            console.error('The method EmailSentSuccessfully is not defined on the scope.');
        }
    } catch (error) {
        console.error('An error occurred:', error);

        var errorMessage = "An error occurred. Please check your address and try again.";
        $('#emailError').show();
        $('#emailErrorMessage').text(errorMessage);


        var emailInput = $('#txtEmail');
        emailInput.addClass('error-border');
    }
}
function emailloading() {
    try {
        var _scope = angular.element(document.querySelector("#questionController")).scope();
        $('#Emailloadingmessage').css('display', 'block');
        $('.sendemailbtn_new').css('display', 'none');
        $('#txtEmail').css('display', 'none');
        $('#email').css('display', 'none');



    } catch (error) {
        console.error('An error occurred:', error);

        var errorMessage = "An error occurred. Please check your address and try again.";
        $('#emailError').show();
        $('#emailErrorMessage').text(errorMessage);



    }
}
function DeselectQuestionAnswer() {
    var _element = $('input[type=radio]:checked');
    var _scope = angular.element(_element[0]).scope();
    var element = $('div[ng-show*="currentQuestion==' + _scope.currentQuestion + '"] input[type=radio]:checked');
    //element.parent().addClass('active');              
    //$('div[ng-show="currentQuestion==' + _scope.currentQuestion + '"] input[type=radio]:not(:checked)').parent().removeClass('active');
    element.prop("checked", false);
    var ngModel = element.attr('ng-model');
    ngModel = ngModel.split(".");
    _scope[ngModel[0]][ngModel[1]] = null;

}


//document.addEventListener('DOMContentLoaded', function () {
//    // Initialize the checkbox images on page load
//    document.addEventListener('DOMContentLoaded', updateCheckboxImages);

//    // Function to update the state of the checkboxes
//    function updateCheckboxState() {
//        if (unlikelyCheckbox.checked) {
//            likelyCheckbox.disabled = true;
//        } else if (likelyCheckbox.checked) {
//            unlikelyCheckbox.disabled = true;
//        } else {
//            unlikelyCheckbox.disabled = false;
//            likelyCheckbox.disabled = false;
//        }
//    }

//    // Initialize the state based on the current checkbox values
//    updateCheckboxState();

//    // Add event listeners to update state when a checkbox is clicked
//    unlikelyCheckbox.addEventListener('change', updateCheckboxState);
//    likelyCheckbox.addEventListener('change', updateCheckboxState);
//});
$(document).ready(function () {

    $('#unlikely').hide();
    $('#likely').hide();
    $('#uncheckedimage').hide();
    $('#checkedimage').hide();
    $('#uncheckedimageunchecked').hide();
    $('#checkedimageunchecked').hide();

    $('#grayscale').css('filter', 'grayscale(100%)');

    // Check the initial state of the checkboxes
    if ($('#unlikely').is(':checked')) {
        $('#uncheckedimage').show();
        $('#checkedimageunchecked').show();
        $('#Unlikelylable').css('color', 'black'); // Set to black when checked
    } else {
        $('#Unlikelylable').css('color', 'grey'); // Set to grey when unchecked
    }

    if ($('#likely').is(':checked')) {
        $('#checkedimage').show();
        $('#uncheckedimageunchecked').show();
        $('#Likelylable').css('color', 'black'); // Set to black when checked
    } else {
        $('#Likelylable').css('color', 'grey'); // Set to grey when unchecked
    }

    // Add change event listeners to checkboxes
    $('#unlikely').change(function () {
        if ($(this).is(':checked')) {
            $('#uncheckedimage').show();
            $('#checkedimageunchecked').show();
            $('#Unlikelylable').css('color', 'black'); // Set to black when checked
        } else {
            $('#uncheckedimage').hide();
            $('#checkedimageunchecked').hide();
            $('#Unlikelylable').css('color', 'grey'); // Set to grey when unchecked
        }
    });

    $('#likely').change(function () {
        if ($(this).is(':checked')) {
            $('#checkedimage').show();
            $('#uncheckedimageunchecked').show();
            $('#Likelylable').css('color', 'black'); // Set to black when checked
        } else {
            $('#checkedimage').hide();
            $('#uncheckedimageunchecked').hide();
            $('#Likelylable').css('color', 'grey'); // Set to grey when unchecked
        }
    });


});


$(document).on('click', '.another-copy', function () {
    downloadAnotherCopy();
});
$('#sentemail').on('click', function () {

    $('.inputemail').css('background-image', 'none !important');

    $('#Emailsent').hide();
    $('.sendemailbtn_new').css('display', 'block');
    $('#txtEmail').css('display', 'block');
    $('#txtEmail').val('').focus();
    $('#email').css('display', 'block');

});



function pdfreport() {
    debugger;
    var userGUID = window.userGUID;
    var surveyData = window.surveyData
    var queryString = '/Report/LatestIndex?userID=' + userGUID + "&currentSurveys=" + surveyData;
    var urlParams = new URLSearchParams(queryString);
    var userId = urlParams.get('userID');
    var CurrentSurveys = urlParams.get('currentSurveys');

    downloadReport(userId, CurrentSurveys)
        .then(() => {

            handleDownloadSuccess();
        })
        .catch(() => {

            handleDownloadError();
        });
}

function handleDownloadSuccess() {
    var downloadButton = document.querySelector('.downloadbtn_new');
    if (downloadButton) {
        downloadButton.style.display = 'none';
    }

    var newDivHtml = `
        <div class="col-md-8 fixed-size-box">
            <div class="row send-emailsize">
                <p class="inputemailanotation-Download">
                    <img src="/Images/DownloadComplete.svg" alt="Icon" class="image-format">
                </p>
                <p class="Report-download">Report downloaded</p>
                  <p class="another-copy" id="downloadAnotherCopy">download another copy</p>
            </div>
        </div>
    `;

    var container = document.querySelector('.downloadaReportpdf-button');
    if (container) {
        container.innerHTML = newDivHtml;
    } else {
        console.error('Container element not found.');
    }
}

function handleDownloading() {
    var downloadButton = document.querySelector('.downloadbtn_new');
    if (downloadButton) {
        downloadButton.style.display = 'none';
    }

    var newDivHtml = `
   <div class="col-md-8 report-downloading">
     <div class="row send-emailsize">

         <p class="Report-download  reports-down">Report downloading ...</p>
         <p class="small-text">This may take a moment</p>
     </div>
 </div>
`;

    var container = document.querySelector('.downloadaReportpdf-button');
    if (container) {
        container.innerHTML = newDivHtml;
    } else {
        console.error('Container element not found.');
    }
}
function hideLoadingMessage() {
    var loadingMessage = document.getElementById('loadingMessage');
    if (loadingMessage) {
        document.body.removeChild(loadingMessage);
    }
}
function handleDownloadError() {

    var newDivHtml = `
    <div class="col-md-8 download-error">
        <div class="row ">
            <p class="inputemailanotation-Download">
              <img src="/Images/DownloadError.svg" alt="Icon" class="image-format">
            </p>
            <p class="Report-download">Unable to download pdf</p>
            <p class="another-copy" id="downloadAnotherCopy">try again</p>
        </div>
    </div>
    `;

    var container = document.querySelector('.downloadaReportpdf-button');
    if (container) {
        container.innerHTML = newDivHtml;
    } else {
        console.error('Container element not found.');
    }
}

function hideLoadingMessage() {
    var loadingMessage = document.getElementById('loadingMessage');
    if (loadingMessage) {
        document.body.removeChild(loadingMessage);
    }
}


function downloadReport(userId, CurrentSurveys) {
    var userGUID = window.userGUID;
    var surveyData = window.surveyData
    var url = '/Report/NewPdfDownloadFile?userID=' + userGUID + "&currentSurveys=" + surveyData;
    handleDownloading();

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.arrayBuffer();
        })
        .then(arrayBuffer => {
            var blob = new Blob([arrayBuffer], { type: 'application/pdf' });
            var link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = 'NEWSS_MentalHealthCheck_Report.pdf';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            hideLoadingMessage();
            handleDownloadSuccess();
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
            hideLoadingMessage();
        });
}

$(document).on('click', '.another-copy', function () {
    downloadAnotherCopy();
});
$('#sentemail').on('click', function () {

    $('.inputemail').css('background-image', 'none !important');
    $('#Emailsent').hide(); // Hides the popup
    $('.sendemailbtn_new').css('display', 'block');
    $('#txtEmail').css('display', 'block');
    $('#txtEmail').val('').focus();
    $('#email').css('display', 'block');

});


function downloadAnotherCopy() {
    var userGUID = window.userGUID;
    var surveyData = window.surveyData
    var queryString = '/Report/NewPdfDownloadFile?userID=' + userGUID + "&currentSurveys=" + surveyData;
    /*  var queryString = window.location.search;*/
    var urlParams = new URLSearchParams(queryString);
    var userId = urlParams.get('userID');
    var CurrentSurveys = urlParams.get('currentSurveys');


    downloadReport(userId, CurrentSurveys);

}




$('#sendEmailButton').on('click', sendEmailReport); // Assuming you have a button with this ID

function sendEmailReport() {


    if (validateEmailForm()) {
        $('#loadingIndicator').show();
        $('#reportView').show();
        $('#emailSentIndicator').hide();
        $('#reportViewedIndicator').show();
        $('#feedbackSurvey').show();
        $('.inputemail').css('background-image', '');

        var userGUID = window.userGUID;
        var surveyData = window.surveyData
        const urlParams = '/Report/NewPdfDownloadFile?userID=' + userGUID + "&currentSurveys=" + surveyData;
        var sendEmail = {
            userID: userGUID,
            currentSurveys: surveyData,
            Name: '',
            Email: $('#txtEmail').val(),
            IsREIntegration: $('#isREIntegration').is(':checked'),
            ID: 0
        };
        let header = $('[name=__RequestVerificationToken]').val();

        $('#dynamicHtml').empty();

        emailloading();
        $.ajax({
            url: '/Report/SendEmail',
            type: 'POST',
            headers: {
                'X-XSRF-Token': header
            },
            data: JSON.stringify(sendEmail),
            contentType: 'application/json',
            success: function (data) {

                handleSurveyResponse(data, function () {
                    /*  $('#txtEmail').val('');*/

                    $('#Emailloadingmessage').css('display', 'none');
                    EmailSentSuccessfully();
                });
            },
            error: handleSurveyErrorCallback
        });


    }
}

function validateEmailForm() {
    $('#emailErrorMessage').text('');

    var isValid = true;

    var emailInput = $('#txtEmail');
    var emailValue = emailInput.val();

    // Reset error states
    $('#emailError').hide();
    emailInput.removeClass('error-border');

    if (!emailValue) {
        var errorMessage = "Please enter your email address.";
        $('.inputemail').css('background-image', "url('/images/invalidicon.svg')");
        $('#emailError').show();
        $('#emailErrorMessage').text(errorMessage);
        emailInput.addClass('error-border');
        isValid = false;
    } else if (emailValue.indexOf('@') === -1) {
        var errorMessage = "Please include an ‘@’ in the email address.";
        $('.inputemail').css('background-image', "url('/images/invalidicon.svg')");
        $('#emailError').show();
        $('#emailErrorMessage').text(errorMessage);
        emailInput.addClass('error-border');
        isValid = false;
    } else {
        var emailPattern = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,6}$/;

        if (!emailPattern.test(emailValue)) {
            var errorMessage = "Please enter a valid email address.";
            $('#emailError').show();
            $('#emailErrorMessage').text(errorMessage);
            emailInput.addClass('error-border');
            $('.inputemail').css('background-image', "url('/images/invalidicon.svg')");
            isValid = false;
        }
    }

    if (isValid) {
        $('#emailError').hide();
        $('#emailErrorMessage').text('');
        emailInput.removeClass('error-border');
    }

    return isValid;
}



function validateEmail(email) {
    var emailPattern = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,6}$/;
    return emailPattern.test(email);
}


function getCurrentSurveyString() {
    var data = '';
    for (var i = 0; i < _CurrentSurveys.length; i++) {
        if (_CurrentSurveys[i] === _SurveyType.PHQ9 ||
            _CurrentSurveys[i] === _SurveyType.GAD7 ||
            _CurrentSurveys[i] === _SurveyType.PTSD) {
            data += _CurrentSurveys[i] + ",";
        }
    }
    if (data !== '') {
        data = data.substring(0, data.length - 1);
    }
    return data;
}

function handleSurveyResponse(data, callback) {

    if (callback) callback();
}

function handleSurveyErrorCallback(error) {

    console.error(error);
    $('#loadingIndicator').hide();
}
function emailSentSuccessfully() {
    $scope.isLoading = false;
    $scope.EmailSent = true;
}

function EmailSentSuccessfully() {
    try {
        $('#Emailsent').show();
        $('.sendemailbtn_new').hide();
        $('#txtEmail, #email').hide();

        var emailValue = $('#txtEmail').val();
        $('#emailname').text(emailValue);


        console.log('Email sent successfully to:', emailValue);
    } catch (error) {
        console.error('An error occurred:', error);

        var errorMessage = "An error occurred. Please check your address and try again.";
        $('#emailError').show().text(errorMessage);
        $('#txtEmail').addClass('error-border');
    }
}


$(document).ready(function () {
    $('#popup').hide();
    document.getElementById('popup-overlay').style.display = 'none';

});


document.querySelectorAll('.panel-heading').forEach(function (panel) {
    const arrow = panel.querySelector('.arrow-down svg');

    const isExpanded = panel.getAttribute('aria-expanded') === 'true';
    if (isExpanded) {
        arrow.style.transform = 'rotate(180deg)';

    } else {
        arrow.style.transform = 'rotate(0deg)';

    }


    panel.addEventListener('click', function () {
        const isExpanded = panel.getAttribute('aria-expanded') === 'true';

        if (isExpanded) {
            arrow.style.transform = 'rotate(0deg)';

        } else {
            arrow.style.transform = 'rotate(180deg)';
        }
    });
});
$(document).ready(function () {
    $('#Under18Modal').on('hidden.bs.modal', function () {

        var scope = angular.element(document.querySelector('[ng-controller]')).scope();
        scope.$apply(function () {
            scope.showUnder18Warning = true;
        });
    });
});


$(document).on('click', '#under18', function () {
    var scope = angular.element(document.querySelector('[ng-controller]')).scope();
    scope.DemographicQuestions = {
        DescribeMeLayer1ID: null, DescribeMeLayer2ID: null, DescribesYouFamilyEmergency: null, Gender: "0", Postcode: null, OtherGender: null, IsSeenDoctor: null, DescribeMeOther: "", VisitingTailored: null, VisitingInformation: null, VisitingEncouragement: null, StateID: null, User_indigenous_identity: null, IsVolunteer: null, IsBushFireAffectedHealth: null,
        VisitingInformationConcern: null, VisitingSeeing: null, VisitingOthers: null, VisitingOthersText: null,
        ServiceFace: null, ServiceDigital: null, ServiceInformation: null, ServiceMood: null, ServiceOther: null, ServiceOtherText: null,
        MentalHealthOther: null, RoleAtEWS: "0", OtherRoleAtEWS: "", OtherRoleAtService: "", RolRoleAtProfessioneAtEWS: "0", OtherRoleAtProfession: ""
    };

});



