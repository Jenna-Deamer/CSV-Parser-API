const csvService = require('../services/csvService');

exports.handleUpload = async (req, res) => {
  try {
    // Extract the file content as a UTF-8 string
    const fileBuffer = req.file.buffer.toString('utf-8');
    
    // Parse the mapping object from the request body
    const mapping = JSON.parse(req.body.mapping);
    
    // Get the selected account identifier
    const account = req.body.account;

    console.log('=== BACKEND RECEIVED DATA ===');
    console.log('File received:', {
      filename: req.file.originalname,
      size: req.file.size,
      mimetype: req.file.mimetype,
      preview: fileBuffer.substring(0, 200) + (fileBuffer.length > 200 ? '...' : '')
    });
    console.log('Mappings received:', mapping);
    console.log('Selected account:', account);
    console.log('==============================');

    // Process the CSV file using CSVService
    const transactions = csvService.parseAndMapCSV(fileBuffer, mapping);

    // Return success response with processed data
    return res.status(200).json({
      message: 'Upload processed',
      account,
      transactions,
    });
  } catch (error) {
    // Handle any errors that occur during processing
    console.error('Upload error:', error);
    return res.status(500).json({ error: 'Failed to process upload.' });
  }
};
