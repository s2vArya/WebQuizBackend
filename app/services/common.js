
exports.getList = async (model, condition, attributes, limit, offset, order) => {
  try {
    const list = await model.findAndCountAll({
      ...condition !== undefined && {
        where: condition
      },
      ...attributes !== undefined && {
        attributes
      },
      ...limit !== undefined && {
        limit
      },
      ...offset !== undefined && {
        offset
      },
      ...order !== undefined && {
        order
      }

    });
    return list ? JSON.parse(JSON.stringify(list)) : false;
  } catch (error) {
    return false;
  }
};

exports.addDetail = async (model, data, transaction) => {
  try {
    const addInfo = await model.create(data, { transaction });

    return addInfo ? JSON.parse(JSON.stringify(addInfo)) : false;
  } catch (error) {
    console.error('AddAuthDetail>>>>>>>>>', error);
    return false;
  }
};

exports.addBulkData = async (model, data, transaction) => {
  try {
    const addBulkInfo = await model.bulkCreate(data, { transaction });

    return addBulkInfo ? JSON.parse(JSON.stringify(addBulkInfo)) : false;
  } catch (error) {
    console.error('AddAuthDetail>>>>>>>>>', error);
    return false;
  }
};

exports.updateData = async (model, data, condition, transaction) => {
  try {
    const result = await model.update(data, { where: condition }, { transaction });
    return result || false;
  } catch (error) {
    console.log('errrror>>>>>>>', error);
    return false;
  }
};

exports.findByCondition = async (model, condition) => {
  try {
    const data = await model.findOne(
      { where: condition }
    );

    return data ? JSON.parse(JSON.stringify(data)) : false;
  } catch (error) {
    console.log('err>>>>>>>>>>>>>> in find', error);
    return false;
  }
};

exports.findWithAttributes = async (model, condition, attributes) => {
  try {
    const data = await model.findOne({
      ...condition !== undefined && {
        where: condition
      },
      ...attributes !== undefined && {
        attributes
      }
    });

    return data ? JSON.parse(JSON.stringify(data)) : false;
  } catch (error) {
    console.log('err>>>>>>>>>>>>>> in find', error);
    return false;
  }
};

exports.deleteQuery = async (model, condition, transaction, force = false) => {
  try {
    const data = await model.destroy(
      { where: condition, force },
      { transaction }
    );
    return data ? JSON.parse(JSON.stringify(data)) : false;
  } catch (error) {
    return false;
  }
};

exports.count = async (model, condition) => {
  try {
    const total = await model.count({ where: condition });
    return total ? JSON.parse(JSON.stringify(total)) : 0;
  } catch (error) {
    return false;
  }
};

exports.countWithGroup = async (model, condition, group) => {
  try {
    const total = await model.count({ where: condition, group });
    return total ? JSON.parse(JSON.stringify(total)) : 0;
  } catch (error) {
    return false;
  }
};

exports.findAllData = async (model, condition, attributes) => {
  try {
    const total = await model.findAll(
      {
        where: condition,
        ...attributes !== undefined && {
          attributes
        },
        distinct: true
      }
    );
    return total ? JSON.parse(JSON.stringify(total)) : 0;
  } catch (error) {
    return false;
  }
};
