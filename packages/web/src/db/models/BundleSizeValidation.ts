import type { BundleSizeValidationDocument } from 'in-it-shared-types';
import { Schema, model, models, Model } from 'mongoose';

const bundleSizeValidationSchema = new Schema<BundleSizeValidationDocument>(
  {
    appId: {
      type: String,
      required: true,
      ref: 'App',
      index: true,
    },
    buildId: {
      type: String,
      required: true,
      unique: true,
    },
    commitHash: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    trackedFiles: {
      type: Schema.Types.Mixed,
    },
  },
  { timestamps: true, strict: false },
);

const BundleSizeValidation: Model<BundleSizeValidationDocument> =
  models.BundleSizeValidation ??
  model<BundleSizeValidationDocument>('BundleSizeValidation', bundleSizeValidationSchema);

export default BundleSizeValidation;
