import { AppsDocument } from 'in-it-shared-types';
import { Schema, model, models, Model } from 'mongoose';

const appSchema = new Schema<AppsDocument>(
  {
    repository: {
      type: String,
    },
    provider: {
      type: String,
    },
    packagePath: {
      type: String,
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
