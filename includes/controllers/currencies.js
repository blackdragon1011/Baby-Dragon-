module.exports = function ({ models }) {
    const Currencies = models.use('Currencies');

    async function getData(userID) {
        try {
            const data = await Currencies.findOne({ where: { userID } });
            if (data) return data.get({ plain: true });
            else return false;
        } catch (error) {
            console.error(error);
            throw new Error(error);
        }
    }

    async function createData(userID, defaults = {}) {
        if (typeof defaults != 'object') throw "Defaults must be an object";
        try {
            // Default balance = 1,000,000
            const defaultData = Object.assign({ money: 1000000, exp: 0 }, defaults);
            await Currencies.findOrCreate({ where: { userID }, defaults: defaultData });
            return true;
        } catch (error) {
            console.error(error);
            throw new Error(error);
        }
    }

    async function increaseMoney(userID, money) {
        if (typeof money != 'number') throw "Money must be a number";
        const user = await getData(userID);
        if (!user) await createData(userID, { money: money });
        else await setData(userID, { money: user.money + money });
        return true;
    }

    async function decreaseMoney(userID, money) {
        if (typeof money != 'number') throw "Money must be a number";
        const user = await getData(userID);
        if (!user) await createData(userID, { money: 1000000 });
        else if (user.money < money) return false;
        else await setData(userID, { money: user.money - money });
        return true;
    }

    async function setData(userID, options = {}) {
        if (typeof options != 'object') throw "Options must be an object";
        try {
            const user = await Currencies.findOne({ where: { userID } });
            if (!user) await createData(userID, options);
            else await user.update(options);
            return true;
        } catch (error) {
            console.error(error);
            throw new Error(error);
        }
    }

    async function delData(userID) {
        try {
            const user = await Currencies.findOne({ where: { userID } });
            if (user) await user.destroy();
            return true;
        } catch (error) {
            console.error(error);
            throw new Error(error);
        }
    }

    async function getAll(...data) {
        let where, attributes;
        for (const i of data) {
            if (typeof i != 'object') throw "Currencies need object or array";
            if (Array.isArray(i)) attributes = i;
            else where = i;
        }
        try {
            return (await Currencies.findAll({ where, attributes })).map(e => e.get({ plain: true }));
        } catch (error) {
            console.error(error);
            throw new Error(error);
        }
    }

    return {
        getData,
        createData,
        increaseMoney,
        decreaseMoney,
        setData,
        delData,
        getAll
    };
};
