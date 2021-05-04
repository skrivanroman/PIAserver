API: (vše posílat ve formátu json s headerem Content-Type: application/json)

    založení uživatele
    POST /user/register
    formát requestu:
        userName: string().regex(/^[A-z0-9_]{3,50}$/).required(), --také nesmí být zabrané
        password: string().regex(/^[A-z0-9_]{6,50}$/).required()

    přihlášení je potřeba k provádění všech funkcí kromě registrace
    POST /users/login
    formát requestu:
        userName: string().regex(/^[A-z0-9_]{3,50}$/).required(),
        password: string().regex(/^[A-z0-9_]{6,50}$/).required()
    po úspěšném loginu server odpoví authentikačním tokenem který se používá jako header 
    auth-token u dalších requestů

    získat text vinu z obrázku --vyžaduje přihlášení
    POST /vin
    formát requestu:
        image: Joi.string().required(), --obrázek v base64
        desiredWidth: Joi.number().min(0).max(1).required(),
        desiredHeight: Joi.number().min(0).max(1).required()
    je třeba specifikovat jakou část obrázku zabírá vin 
    předpokládá se že vin je vycentrovaný

    získat šablonu
    POST /vin/text
    formát requestu:
        vin: string().regex(/^[0-9ABCDEFGHJKLMNPRSTUVWXYZ]{17}$/).required()
    odpověď:
        template: šablona v base64 
        sessionId: ID focení

