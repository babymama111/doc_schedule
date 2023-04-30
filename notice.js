
const mongoose = require('mongoose');

// Подключение к базе данных
mongoose.connect(
  'mongodb+srv://ilyaberulava:1898@cluster1.k5zmftd.mongodb.net/test',
  { useNewUrlParser: true, useUnifiedTopology: true }
)
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

// Определение схемы и модели для коллекции
const Schema = mongoose.Schema;
const mySchema = new Schema({
  scheduledAt: { type: Date, required: true },
  notificationSentAt: { type: Date, default: null },
});
const MyModel = mongoose.model('mycollection', mySchema);

// Выборка данных
const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);
const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);
const query = {
  $or: [
    { notificationSentAt: null, scheduledAt: { $lte: twoHoursAgo } },
    { notificationSentAt: null, scheduledAt: { $lte: tomorrow } },
  ],
};
MyModel.find(query, function(err, results) {
  if (err) throw err;

  // Отправка уведомлений
  results.forEach(function(result) {
    if (result.scheduledAt <= twoHoursAgo) {
      console.log('Уведомление за 2 часа: ', result);
    }
    if (result.scheduledAt <= tomorrow) {
      console.log('Уведомление за день: ', result);
    }

    // Обновление записи в базе данных
    const updateQuery = { _id: result._id };
    const update = {
      $set: { notificationSentAt: new Date() },
    };
    MyModel.updateOne(updateQuery, update, function(err, result) {
      if (err) throw err;
    });
  });

  // Закрытие соединения с базой данных
  mongoose.connection.close();
});