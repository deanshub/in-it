import { AppsDocument } from 'in-it-shared-types';
import { Schema, model, models, Model } from 'mongoose';

const appSchema = new Schema<AppsDocument>(
  {
    repository: {
      type: String,
      required: true,
    },
    packagePath: {
      type: String,
      required: true,
    },
    name: {
      type: String,
    },
    packageName: {
      type: String,
    },
  },
  { timestamps: true },
);

const App: Model<AppsDocument> = models.App ?? model<AppsDocument>('App', appSchema);

export default App;
