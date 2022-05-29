export default {
    InputName: 'מסמך נכנס',
    outputName: 'מסמך יוצא',
    MappingSchema: 'מיפוי המסמך',
    change: 'שנה',
    remove: 'מחק',
    confirm: 'מאשר',
    cancel: 'ביטול',
    ok: 'אישור',
    messages: {
        deleteLink: 'אתה בטוח שאתה רוצה למחוק את הלינק ?',
        replaceLink: 'אתה בטוח שאתה רוצה להחליף את הלינק ?',
    },
    backOffice: {
        header: 'מערכת ניהול',

        labels: {
            name: 'שם',
            icon_url: 'לינק לאיקון',
            anchor: 'לעגן',
            mapping: 'מיפוי',

            filters: 'סינונים',
            orderId: 'מספר הזמנה',
            trackingId: 'מספר מעקב',
            postCode: 'מיקוד',
            sku: 'SKU',
            search: 'Search',

            status: 'מצב נוכחי',
            pending: 'ממתין',
            approved: 'אושר',
            rejected: 'נדחה',

            code: 'קוד',
            yes: 'כן',
            no: 'לא',
            description: 'פרטים',
            label: 'תווית',
            sortOrder: 'מיין הזמנה',

            data: 'מידע',
            close: 'סגור',
            show: 'חיפוש',
            clear: 'נקה',

            carrier: 'חברת הובלה',
            returnReason: 'סיבת החזרה',
            returnType: 'סוג החזרה',
            returnedItems: 'פריטים שהוחזרו',

            groupBy: 'לפי קבוצה',
            bucketBy: 'לפי באקט',
            countOf: 'נחשב',

            items: 'פריטים',
            orders: 'הזמנות',

            fromDate: 'מתאריך',
            toDate: 'עד תאריך',
            date: 'תאריך',
            hour: 'שעה',
            hourDay: 'שעה ביום',
            day: 'יום',
            week: 'שבוע',
            dayOfWeek: 'יום בשבוע',
            month: 'חודש',
        },

        errors: {
            enterCurrentPassword: 'אנא הזן את הסיסמה הנוכחית שלך',
            enterNewPassword: 'נא להזין את הסיסמה החדשה שלך',
            noEmailData: 'אנא הכנס את כתובת הדוא"ל שלך',
            noPasswordData: 'הזן את סיסמתך בבקשה',
            notValidPasswordLength: 'Password must be at least 6 characters.',
            notValidEmail: 'סיסמא חייבת להיות לפחות בת 6 תווים.',
        },


        login: {
            title: 'התחברות',
            forgotPassword: 'שחכת סיסמא?',
            buttonDataLabel: 'התחבר',
        },

        forgotPassword: {
            rememberPassword: 'זוכר את הססמא שלך ?',
            buttonDataLabel: 'שלח',
            title: 'שחזור סיסמא',
            description: 'הזן את כתובת האימייל המשויכת לחשבון שלך ואנו נשלח לך קישור לאיפוס הסיסמה שלך.',
        },

        resetPassword: {
            title: 'איפוס סיסמא',
            buttonDataLabel: 'שלח לי מייל לשחזור ססמא',
        },

        dashBoard: {
            customerCare: 'שירות לקוחות',
            inspections: 'בדיקות',
            statistics: 'סטָטִיסטִיקָה',
            users: 'משתמשים',
            settings: 'הגדרות',
            changePassword: 'שנה סיסמא',
            logOut: 'התנתק',
        },

        changePassword: {
            currentPassword: 'סיסמא נוכחית',
            newPassword: 'סיסמא חדשה',
            repeatPassword: 'חזור על הסיסמה',
            title: 'שינוי סיסמא',
            save: 'שמור',
        },

        inspectionsTab: {
            returnApproved: 'החזרה אושרה',
            returnPending: 'החזרה ממתינה כעת',
            returnRejected: 'החזרה נדחתה',
        },

        returnTab: {
            authorizer: 'הרשאות',
            refund: 'הֶחזֵר כספי',
            exchange: 'החלפה',
        },

        statsTab: {
            title: 'סטטיסטיקה',
            table: 'טבלה',
            graph: 'גרף',
            showLayer: 'הצג שכבה',
            selectLeastOfOneOptions: 'לפי קבוצה, bucket by',
        },

        usersTab: {
            title: 'משתמשים',
            firstName: 'שם פרטי',
            lastName: 'שם משפחה',
            email: 'אימייל',
            role: 'תַפְקִיד',
            deleteUserMessage: 'האם אתה בטוח שברצונך למחוק משתמש זה?'
        },
        returnReasonsTab: {
            title: 'סיבות החזרה',
            otailoCategory: 'קטגוריית אוטיילו',
            isVisible: 'גלוי',
            addReason: 'הוסף סיבה',
            otailoCategoryOptions: [
                {
                    label: 'חרטה של לקוחות',
                    value: 'CustomerRemorse'
                },
                {
                    label: 'סוגריים',
                    value: 'Bracketing'
                },
                {
                    label: 'התנהגות הונאה',
                    value: 'FraudulentBehavior'
                },
                {
                    label: 'אי התאמה בין וריאציות המוצר',
                    value: 'ProductVariantMismatch'
                },
                {
                    label: 'ציפיות המוצר לא מולאו',
                    value: 'ProductExpectationsUnmet'
                },
                {
                    label: 'מוצר פגום',
                    value: 'FaultyProduct'
                },
                {
                    label: 'פורסם בצורה לא נכונה',
                    value: 'IncorrectlyAdvertised'
                },
                {
                    label: 'שגיאת הגשמה',
                    value: 'FulfillmentError'
                },
                {
                    label: 'משלוח פגום',
                    value: 'DamagedShipment'
                },
                {
                    label: 'איחור במשלוח',
                    value: 'LateShipment'
                },
                {
                    label: 'אחר',
                    value: 'Other'
                }
            ],
            addNewFaulty: 'הוסף מוצר פגום חדש'

        },
        geographicLayersTab: {
            title: 'שכבות גיאוגרפיות',
            addLayer: 'הוסף שכבה',
            deleteConfirmMessage: 'האם אתה בטוח שברצונך למחוק את השכבה הזו?',
            updatePoi: 'החנויות הועלו בהצלחה'
        }
    },
}
