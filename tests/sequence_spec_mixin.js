/* eslint-env jasmine */
// TODO implement and test conversion from old to new feature and range
// instances

import _ from 'underscore.mixed';


export default function testAllSequenceModels(Sequence) {

  var initialSequenceContent = 'ATCGATCGATCGATCG';
  var stickyEnds = {
    start: {
      sequence: 'CCTGCAGTCAGTGGTCTCT' + 'AGAG',
      reverse: false,
      offset: 19,
      size: 4,
      name: "X",
    },
    end: {
      sequence: 'GAGA' + 'TGAGACCGTCAGTCACGAG',
      reverse: true,
      offset: 19,
      size: 4,
      name: "Z'",
    }
  };

  var stickyEndedSequenceContent = stickyEnds.start.sequence + initialSequenceContent + stickyEnds.end.sequence;

  var stickyEndedSequenceContentWithOverhang = stickyEndedSequenceContent.substring(stickyEnds.start.offset, stickyEndedSequenceContent.length - stickyEnds.end.offset);


  var sequenceAttributes = {
    name: 'Test sequence',
    sequence: initialSequenceContent,
    features: [{
      ranges: [{
        from: 3,
        to: 7
      }],
      name: 'test feature',
      desc: 'test feature description',
      type: 'gene'
    }]
  };

  var stickyEndedSequenceAttributes = {
    name: 'Sticky Ended Sequence',
    sequence: stickyEndedSequenceContent,
    features: [
    {
      id: 1,
      name: 'Sticky End Feature',
      desc: 'This one will not show on clipped sticky ends.',
      ranges: [{
        from: 0,
        to: 2
      }],
      type: 'gene',
    },
    {
      id: 2,
      name: 'Start Clipped Feature',
      desc: 'This one will be a shortened feature for clipped sticky end format.',
      ranges: [{
        from: 1,
        to: 30
      }],
      type: 'gene',
    },
    {
      id: 3,
      name: 'Normal Feature',
      desc: 'This one will not be affected by clipped sticky ends.',
      ranges: [{
        from: 24,
        to: 27
      }],
      type: 'gene',
    },
    {
      id: 4,
      name: 'End Clipped Feature',
      desc: 'This one will be shortened at the end for clipped sticky end format.',
      ranges: [{
        from: 30,
        to: stickyEndedSequenceContent.length - 2
      },
      {
        // This range should be dropped if stickyEndFormat is not "full"
        from: stickyEndedSequenceContent.length - 19,
        to: stickyEndedSequenceContent.length - 1
      }],
      type: 'gene',
    },
    {
      id: 5,
      name: 'End Feature dropped',
      desc: 'This one sould be dropped if stickyEndFormat is not "full"',
      ranges: [{
        from: stickyEndedSequenceContent.length - 19,
        to: stickyEndedSequenceContent.length - 1
      }],
      type: 'gene',
    },
    ],
    stickyEnds: stickyEnds
  };

  var startStickyEndSequence = 'CCTA';
  var startStickySequenceAttributes = {
    name: 'startStickySequence',
    sequence: startStickyEndSequence + 'CCCCCCCCCCC',
    id: 2,
    from: 0,
    to: 14,
    stickyEnds: {
      // Leave a  3'-AT-5'  sticky end
      start: {
        sequence: startStickyEndSequence,
        reverse: true,
        offset: 2,
        size: 2,
      }
    },
    features: [
    {
      name: 'startStickySequenceAnnotationShouldStay',
      _type: 'sequence',
      ranges: [{
        from: 2,
        to: 2,
      }]
    },
    {
      name: 'startStickySequenceAnnotationShouldBeRemoved',
      _type: 'sequence',
      ranges: [{
        from: 1,
        to: 2,
      }]
    }
    ]
  };

  var endStickyEndSequence = 'TACC';
  var endStickySequenceAttributes = {
    name: 'endStickySequence',
    sequence: 'CCCCCCCCCCCGG' + endStickyEndSequence,
    id: 1,
    from: 0,
    to: 16,
    stickyEnds: {
      // Leave a TA sticky end
      end: {
        sequence: endStickyEndSequence,
        reverse: false,
        offset: 2,
        size: 2,
      }
    },
    features: [{
      name: 'endStickySequenceAnnotation',
      _type: 'sequence',
      ranges: [{
        from: 3,
        to: 8,
      }]
    },
    {
      name: 'endStickySequenceEndAnnotation',
      _type: 'sequence',
      ranges: [{
        from: 11,
        to: 14,
      }]
    }]
  };

  startStickyEndSequence = 'GGGTA';
  endStickyEndSequence = 'TAGG';
  var stickySequenceAttributes = {
    name: 'stickySequence',
    sequence: startStickyEndSequence + 'CCGGGGGGGGG' + endStickyEndSequence,
    id: 3,
    from: 0,
    to: 19,
    stickyEnds: {
      // Leave a 3'-AT-5' sticky end on the reverse strand
      start: {
        sequence: startStickyEndSequence,
        reverse: true,
        offset: 3,
        size: 2,
      },
      // Leave a 5'-TA-3' sticky end
      end: {
        sequence: endStickyEndSequence,
        reverse: false,
        offset: 2,
        size: 2,
      }
    },
    features: [{
      name: 'stickySequenceAnnotation',
      _type: 'sequence',
      ranges: [{
        from: 17,
        to: 17,
      }]
    },
    {
      name: 'stickySequenceAnnotationShouldBeRemoved',
      _type: 'sequence',
      ranges: [{
        from: 17,
        to: 18,
      }]
    },
    {
      name: 'stickySequenceAnnotationShouldAlsoBeRemoved',
      _type: 'sequence',
      ranges: [{
        from: 18,
        to: 17,
      }]
    }]
  };

  var stickyEndedEmptySequenceAttributes = {
    name: 'Empty Sticky Ended Sequence',
    sequence: stickyEnds.start.sequence + stickyEnds.end.sequence,
    features: [],
    stickyEnds: stickyEnds
  };

  var emptySequenceAttributes = {
    name: 'Empty Sequence',
    sequence: '',
    features: []
  };

  var sequence;
  var stickyEndedSequence;
  var endStickySequence;
  var startStickySequence;
  var stickySequence;
  var stickyEndedEmptySequence;
  var emptySequence;

  var setStickyEndFormat = function(format) {
    beforeEach(function() {
      stickyEndedSequence.setStickyEndFormat(format);  
    });
  };

  var spyAndStub = function(_sequence) {
    spyOn(_sequence, 'save');
    spyOn(_sequence, 'throttledSave');
  };

  beforeEach(function() {
    sequence = new Sequence(sequenceAttributes);
    stickyEndedSequence = new Sequence(stickyEndedSequenceAttributes);
    startStickySequence = new Sequence(startStickySequenceAttributes);
    endStickySequence = new Sequence(endStickySequenceAttributes);
    stickySequence = new Sequence(stickySequenceAttributes);
    stickyEndedEmptySequence = new Sequence(stickyEndedEmptySequenceAttributes);
    emptySequence = new Sequence(emptySequenceAttributes);

    ([
      sequence,
      stickyEndedSequence,
      endStickySequence,
      startStickySequence,
      stickySequence,
      stickyEndedEmptySequence,
      emptySequence,
    ]).forEach(spyAndStub);
  });


  describe('creating and reading a sequence', function() {
    it('should instantiate', function() {
      var bases = 'ATCGGGCTTAAGCGTA';
      var sequence = new Sequence({
        name: 'Test Sequence',
        sequence: bases
      });
      expect(sequence).toBeTruthy();
      spyAndStub(sequence);
    });

    it('should be able to get the name', function() {
      expect(sequence.get('name')).toEqual('Test sequence');
    });

    describe('without sticky ends', function() {
      it('should be able to get the sequence', function() {
        expect(sequence.getSequence()).toEqual(initialSequenceContent);
      });

      it('should be able to get a subsequence', function() {
        expect(sequence.getSubSeq(2,5)).toEqual('CGAT');
      });
    });

    describe('with sticky ends', function() {
      describe('with full sticky end formatting', function() {
        beforeEach(function() {
          stickyEndedSequence.setStickyEndFormat('full');
        });

        it('should be able to get the sequence', function() {
          expect(stickyEndedSequence.getSequence()).toEqual(stickyEndedSequenceContent);
        });

        it('should be able to get a subsequence', function() {
          expect(stickyEndedSequence.getSubSeq(2,5)).toEqual('TGCA');
        });
      });

      describe('with overhang sticky end formatting', function() {
        it('should be able to get the sequence', function() {
          expect(stickyEndedSequence.getSequence()).toEqual(stickyEndedSequenceContentWithOverhang);
        });

        it('should be able to get a subsequence', function() {
          expect(stickyEndedSequence.getSubSeq(2,5)).toEqual('AGAT');
        });
      });

      describe('with sticky ends removed', function() {
        beforeEach(function() {
          stickyEndedSequence.setStickyEndFormat('none');
        });

        it('should be able to get the sequence', function() {
          expect(stickyEndedSequence.getSequence()).toEqual(initialSequenceContent);
        });

        it('should be able to get a subsequence', function() {
          expect(stickyEndedSequence.getSubSeq(2,5)).toEqual('CGAT');
        });
      });

      describe('with alternating stickyEndFormat', function() {
        it('should return return the correct length', function() {
          stickyEndedSequence.setStickyEndFormat(stickyEndedSequence.STICKY_END_OVERHANG);
          expect(stickyEndedSequence.getLength()).toEqual(24);
          stickyEndedSequence.setStickyEndFormat(stickyEndedSequence.STICKY_END_NONE);
          expect(stickyEndedSequence.getLength()).toEqual(16);
          stickyEndedSequence.setStickyEndFormat(stickyEndedSequence.STICKY_END_FULL);
          expect(stickyEndedSequence.getLength()).toEqual(62);
        });
      });
    });


    describe('getting transformed and subsequences', function() {
      var sequence;
      var bases = 'ATCGGGCTTAAGCGTA';
      var allBases = stickyEnds.start.sequence + bases + stickyEnds.end.sequence;
      beforeEach(function() {
        sequence = new Sequence({
          name: 'Test Sequence',
          sequence: allBases,
          stickyEnds: stickyEnds,
        });
        spyAndStub(sequence);
        sequence.setStickyEndFormat(sequence.STICKY_END_NONE);
      });

      it('should be able to get a padded subsequence', function() {
        var result = sequence.getPaddedSubSeq(3, 8, 3);
        expect(result.subSeq).toEqual(bases.substr(3, 6));
        expect(result.startBase).toEqual(3);
        expect(result.endBase).toEqual(8);

        result = sequence.getPaddedSubSeq(2, 8, 3);
        expect(result.subSeq).toEqual(bases.substr(0, 9));
        expect(result.startBase).toEqual(0);
        expect(result.endBase).toEqual(8);

        result = sequence.getPaddedSubSeq(2, 8, 3, 5);
        expect(result.subSeq).toEqual(bases.substr(2, 9));
        expect(result.startBase).toEqual(2);
        expect(result.endBase).toEqual(10);

        result = sequence.getPaddedSubSeq(2, 8, 3, -5);
        expect(result.subSeq).toEqual(bases.substr(1, 9));
        expect(result.startBase).toEqual(1);
        expect(result.endBase).toEqual(9);
      });

      it('should be able to get a transformed subsequence', function() {
        var transformedSubSequence, error;
        try {
          transformedSubSequence = sequence.getTransformedSubSeq('WRonG', {}, 3, 8);
        } catch (e) {
          error = e.toString();
        }
        expect(error).toEqual("Error: Unsupported sequence transform 'WRonG'");

        transformedSubSequence = sequence.getTransformedSubSeq('aa-long', {}, 8, 3);
        expect(transformedSubSequence).toEqual('');

        transformedSubSequence = sequence.getTransformedSubSeq('aa-long', {}, 3, 8);
        expect(transformedSubSequence).toEqual('GlyLeu');

        transformedSubSequence = sequence.getTransformedSubSeq('aa-short', {}, 3, 8);
        expect(transformedSubSequence).toEqual(' G  L ');

        transformedSubSequence = sequence.getTransformedSubSeq('aa-short', {offset: 2}, 3, 8);
        expect(transformedSubSequence).toEqual('R  A  ');

        transformedSubSequence = sequence.getTransformedSubSeq('aa-short', {complements: true}, 3, 8);
        expect(transformedSubSequence).toEqual(' P  E ');
      });

      it('should return amino acids', function() {
        var aAs;
        sequence.setStickyEndFormat(sequence.STICKY_END_NONE);
        aAs = sequence.getAAs(3, 6);
        expect(aAs).toEqual(['G', 'L']);

        aAs = sequence.getAAs(2, 6);
        expect(aAs).toEqual(['R', 'A']);

        sequence.setStickyEndFormat(sequence.STICKY_END_FULL);
        aAs = sequence.getAAs(3, 6);
        expect(aAs).toEqual(['A', 'V']);
      });

      it('should be able get a codon', function() {
        var codon, error;
        try {
          codon = sequence.getCodon(-1);
        } catch (e) {
          error = e.toString();
        }
        expect(error).toEqual("Error: 'base' must be >= 0 but was '-1'");

        codon = sequence.getCodon(0);
        expect(codon.sequence).toEqual(bases.substr(0, 3));
        expect(codon.position).toEqual(0);

        codon = sequence.getCodon(1);
        expect(codon.sequence).toEqual(bases.substr(0, 3));
        expect(codon.position).toEqual(1);

        codon = sequence.getCodon(2);
        expect(codon.sequence).toEqual(bases.substr(0, 3));
        expect(codon.position).toEqual(2);

        codon = sequence.getCodon(3);
        expect(codon.sequence).toEqual(bases.substr(3, 3));
        expect(codon.position).toEqual(0);

        codon = sequence.getCodon(3, 2);
        expect(codon.sequence).toEqual(bases.substr(2, 3));
        expect(codon.position).toEqual(1);

        codon = sequence.getCodon(3, 4);
        expect(codon.sequence).toEqual(bases[3]);
        expect(codon.position).toEqual(1);

        codon = sequence.getCodon(3, -4);
        expect(codon.sequence).toEqual(bases.substr(2, 3));
        expect(codon.position).toEqual(1);
      });

      it('should be able get an amino acid', function() {
        var aminoAcid = sequence.getAA('long', 0);
        expect(aminoAcid.sequence).toEqual('Ile');
        expect(aminoAcid.position).toEqual(0);

        aminoAcid = sequence.getAA('short', 0);
        expect(aminoAcid.sequence).toEqual(' I ');
        expect(aminoAcid.position).toEqual(0);

        aminoAcid = sequence.getAA('short', 1);
        expect(aminoAcid.sequence).toEqual(' I ');
        expect(aminoAcid.position).toEqual(1);

        aminoAcid = sequence.getAA('short', 2);
        expect(aminoAcid.sequence).toEqual(' I ');
        expect(aminoAcid.position).toEqual(2);

        aminoAcid = sequence.getAA('short', 3);
        expect(aminoAcid.sequence).toEqual(' G ');
        expect(aminoAcid.position).toEqual(0);

        aminoAcid = sequence.getAA('short', 3, 2);
        expect(aminoAcid.sequence).toEqual(' R ');
        expect(aminoAcid.position).toEqual(1);

        aminoAcid = sequence.getAA('short', 3, -4);
        expect(aminoAcid.sequence).toEqual(' R ');
        expect(aminoAcid.position).toEqual(1);
      });
    });

  });


  describe('getting features from sticky ended sequences', function() {
    var originalCoords = _.pluck(stickyEndedSequenceAttributes.features, 'ranges');

    describe('with full sticky end formatting', function() {
      var features;
      setStickyEndFormat('full');

      beforeEach(function() {
        features = stickyEndedSequence.getFeatures();
      });

      it('should not distort any features', function() {
        var coords = _.pluck(features, 'ranges');

        var zippedCoords = _.zip(originalCoords, coords);

        var hasDistortedFeature = _.some(zippedCoords, function(set) {
                                    return ((set[0].from != set[1].from) || (set[0].to != set[1].to));
                                  });

        expect(hasDistortedFeature).toBe(false);
      });
    });

    describe('with overhang sticky end formatting', function() {
      var features;
      setStickyEndFormat('overhang');

      beforeEach(function() {
        features = stickyEndedSequence.getFeatures();
      });

      it('should not return features before or after the overhang', function() {
        expect(features[0].id).toEqual(2);
        expect(features.length).toEqual(3);
      });

      it('should shorten features that extend beyond the beginning of the overhang to start at 0', function() {
        expect(features[0].id).toEqual(2);
        expect(features[0].ranges[0].from).toEqual(0);
      });

      it('should adjust the position of features on the sequence by the leading sticky end offset', function() {
        expect(features[0].ranges[0].to).toEqual(originalCoords[1][0].to - stickyEnds.start.offset);

        expect(features[1].ranges[0].from).toEqual(originalCoords[2][0].from - stickyEnds.start.offset);
        expect(features[1].ranges[0].to).toEqual(originalCoords[2][0].to - stickyEnds.start.offset);

        expect(features[2].ranges[0].from).toEqual(originalCoords[3][0].from - stickyEnds.start.offset);
      });

      it('should shorten features that extend beyond the end of the overhang to end at sequence length', function() {
        var sequenceLength = stickyEndedSequence.getLength();
        expect(features[2].ranges[0].to).toEqual(sequenceLength - 1);
      });

      it('should remove feature ranges that extend beyond the end of the overhang to end at sequence length', function() {
        expect(features[2].id).toEqual(4);
        expect(features[2].ranges.length).toEqual(1);
      });
    });

    describe('with sticky end formatting of "none"', function() {
      var features;
      var offset = stickyEnds.start.offset + stickyEnds.start.size;
      setStickyEndFormat('none');

      beforeEach(function() {
        features = stickyEndedSequence.getFeatures();
      });

      it('should not return features before or after the main sequence', function() {
        expect(features[0].id).toEqual(2);
        expect(features.length).toEqual(3);
      });

      it('should shorten features that extend beyond the beginning of the main sequence to start at 0', function() {
        expect(features[0].id).toEqual(2);
        expect(features[0].ranges[0].from).toEqual(0);
      });

      it('should adjust the position of features on the sequence by the leading sticky end offset', function() {
        expect(features[0].ranges[0].to).toEqual(originalCoords[1][0].to - offset);

        expect(features[1].ranges[0].from).toEqual(originalCoords[2][0].from - offset);
        expect(features[1].ranges[0].to).toEqual(originalCoords[2][0].to - offset);

        expect(features[2].ranges[0].from).toEqual(originalCoords[3][0].from - offset);
      });

      it('should shorten features that extend beyond the end of the main sequence to end at sequence length', function() {
        var sequenceLength = stickyEndedSequence.getLength();
        expect(features[2].ranges[0].to).toEqual(sequenceLength - 1);
      });

      it('should remove feature ranges that extend beyond the end of the main sequence to end at sequence length', function() {
        expect(features[2].id).toEqual(4);
        expect(features[2].ranges.length).toEqual(1);
      });
    });

  });


  describe('when inserting bases into a sequence', function() {
    describe('without sticky ends', function() {
      beforeEach(function() {
        sequence.insertBases('AAA', 3);
      });

      it('should update the sequence', function() {
        expect(sequence.getSequence()).toEqual('ATCAAAGATCGATCGATCG');
        expect(sequence.getSubSeq(3, 5)).toEqual('AAA');
        expect(sequence.throttledSave).toHaveBeenCalled();
      });

      it('should move the features', function() {
        var featureRange = sequence.get('features.0.ranges.0');
        expect(featureRange.from).toEqual(6);
        expect(featureRange.to).toEqual(10);
      });
    });

    describe('with sticky ends', function() {
      describe('with full sticky end formatting', function() {
        beforeEach(function() {
          stickyEndedSequence.setStickyEndFormat('full');
          stickyEndedSequence.insertBases('AAA', 3);
        });

        it('should update the sequence', function() {
          expect(stickyEndedSequence.getSequence()).toEqual('CCTAAAGCAGTCAGTGGTCTCTAGAGATCGATCGATCGATCGGAGATGAGACCGTCAGTCACGAG');
          expect(stickyEndedSequence.getSubSeq(3, 5)).toEqual('AAA');
          expect(stickyEndedSequence.throttledSave).toHaveBeenCalled();
        });
      });

      describe('with overhang sticky end formatting', function() {
        beforeEach(function() {
          stickyEndedSequence.insertBases('AAA', 3);
        });

        it('should update the sequence', function() {
          expect(stickyEndedSequence.getSequence(stickyEndedSequence.STICKY_END_FULL)).toEqual('CCTGCAGTCAGTGGTCTCTAGA' + 'AAA' + 'GATCGATCGATCGATCGGAGATGAGACCGTCAGTCACGAG');
          expect(stickyEndedSequence.getSubSeq(3, 5)).toEqual('AAA');
          expect(stickyEndedSequence.throttledSave).toHaveBeenCalled();
        });
      });

      describe('with sticky ends removed', function() {
        beforeEach(function() {
          stickyEndedSequence.setStickyEndFormat('none');
          stickyEndedSequence.insertBases('AAA', 3);
        });

        it('should update the sequence', function() {
          expect(stickyEndedSequence.getSequence(stickyEndedSequence.STICKY_END_FULL)).toEqual('CCTGCAGTCAGTGGTCTCTAGAGATC' + 'AAA' + 'GATCGATCGATCGGAGATGAGACCGTCAGTCACGAG');
          expect(stickyEndedSequence.getSubSeq(3, 5)).toEqual('AAA');
          expect(stickyEndedSequence.throttledSave).toHaveBeenCalled();
        });
      });
    });
  });


  describe('when changing bases into a sequence', function() {
    describe('without sticky ends', function() {
      beforeEach(function() {
        sequence.changeBases(3, 'AAA');
      });

      it('should update the sequence', function() {
        expect(sequence.getSequence()).toEqual('ATCAAACGATCGATCG');
        expect(sequence.getSubSeq(3, 5)).toEqual('AAA');
        expect(sequence.throttledSave).toHaveBeenCalled();
      });

      it('should not move the features', function() {
        var featureRange = sequence.get('features.0.ranges.0');
        expect(featureRange.from).toEqual(3);
        expect(featureRange.to).toEqual(7);
      });
    });

    describe('with sticky ends', function() {
      describe('with full sticky end formatting', function() {
        beforeEach(function() {
          stickyEndedSequence.setStickyEndFormat('full');
          stickyEndedSequence.changeBases(3, 'AAA');
        });

        it('should update the sequence', function() {
          expect(stickyEndedSequence.getSequence()).toEqual('CCT' + 'AAA' + 'GTCAGTGGTCTCTAGAGATCGATCGATCGATCGGAGATGAGACCGTCAGTCACGAG');
          expect(stickyEndedSequence.getSubSeq(3, 5)).toEqual('AAA');
          expect(stickyEndedSequence.throttledSave).toHaveBeenCalled();
        });
      });

      describe('with overhang sticky end formatting', function() {
        beforeEach(function() {
          stickyEndedSequence.setStickyEndFormat('overhang');
          stickyEndedSequence.changeBases(3, 'AAA');
        });

        it('should update the sequence', function() {
          expect(stickyEndedSequence.getSubSeq(3, 5)).toEqual('AAA');
          stickyEndedSequence.setStickyEndFormat('full');
          expect(stickyEndedSequence.getSequence()).toEqual('CCTGCAGTCAGTGGTCTCTAGA' + 'AAA' + 'CGATCGATCGATCGGAGATGAGACCGTCAGTCACGAG');
          expect(stickyEndedSequence.throttledSave).toHaveBeenCalled();
        });
      });

      describe('with sticky ends removed', function() {
        beforeEach(function() {
          stickyEndedSequence.setStickyEndFormat('none');
          stickyEndedSequence.changeBases(3, 'AAA');
        });

        it('should update the sequence', function() {
          expect(stickyEndedSequence.getSubSeq(3, 5)).toEqual('AAA');
          stickyEndedSequence.setStickyEndFormat('full');
          expect(stickyEndedSequence.getSequence()).toEqual('CCTGCAGTCAGTGGTCTCTAGAGATC' + 'AAA' + 'CGATCGATCGGAGATGAGACCGTCAGTCACGAG');
          expect(stickyEndedSequence.throttledSave).toHaveBeenCalled();
        });
      });
    });
  });


  describe('when deleting bases from a sequence in the middle of a feature', function() {
    beforeEach(function() {
      sequence.deleteBases(2, 2);
    });

    it('should update the sequence', function() {
      expect(sequence.getSequence()).toEqual('ATATCGATCGATCG');
      expect(sequence.getSubSeq(3, 5)).toEqual('TCG');
      expect(sequence.throttledSave).toHaveBeenCalled();
    });

    it('should move the beginning of the features', function() {
      var featureRange = sequence.get('features.0.ranges.0');
      expect(featureRange.from).toEqual(2);
    });

    it('should move the end of the features', function() {
      var featureRange = sequence.get('features.0.ranges.0');
      expect(featureRange.to).toEqual(5);
    });
  });


  describe('when deleting bases containing an entire sequence', function() {
    beforeEach(function() {
      sequence.deleteBases(2, 6);
    });

    it('should update the sequence', function() {
      expect(sequence.getSequence()).toEqual('ATATCGATCG');
      expect(sequence.getSubSeq(3, 5)).toEqual('TCG');
      expect(sequence.throttledSave).toHaveBeenCalled();
    });

    it('should delete the feature', function() {
      var features = sequence.getFeatures();
      expect(features.length).toEqual(0);
    });
  });


  describe('when deleting bases from a stickyEnded sequence', function() {
    describe('with full sticky end formatting', function() {
      setStickyEndFormat('full');

      beforeEach(function() {
        stickyEndedSequence.deleteBases(21, 26);
      });

      it('should update the sequence', function() {
        expect(stickyEndedSequence.getSequence()).toEqual('CCTGCAGTCAGTGGTCTCTAGACCGTCAGTCACGAG');
        expect(stickyEndedSequence.throttledSave).toHaveBeenCalled();
      });
    });

    describe('with overhang sticky end formatting', function() {
      beforeEach(function() {
        stickyEndedSequence.deleteBases(21, 16);
      });

      it('should update the sequence', function() {
        expect(stickyEndedSequence.getStickyEndFormat()).toEqual('overhang');
        expect(stickyEndedSequence.getSequence()).toEqual('AGAGATCG');
        stickyEndedSequence.setStickyEndFormat('full');
        expect(stickyEndedSequence.getSequence()).toEqual('CCTGCAGTCAGTGGTCTCTAGAGATCGATCGATCGATCGGCACGAG');
        expect(stickyEndedSequence.throttledSave).toHaveBeenCalled();
      });
    });

    describe('with none sticky end formatting', function() {
      setStickyEndFormat('none');

      beforeEach(function() {
        stickyEndedSequence.deleteBases(21, 16);
      });

      it('should update the sequence', function() {
        expect(stickyEndedSequence.getStickyEndFormat()).toEqual('none');
        expect(stickyEndedSequence.getSequence()).toEqual('');
        stickyEndedSequence.setStickyEndFormat('full');
        expect(stickyEndedSequence.getSequence()).toEqual('CCTGCAGTCAGTGGTCTCTAGAGATCGATCGATCGATCGGAGATAG');
        expect(stickyEndedSequence.throttledSave).toHaveBeenCalled();
      });
    });
  });


  describe('sticky end functions', function() {
    beforeEach(function() {
      startStickySequence.setStickyEndFormat('full');
      endStickySequence.setStickyEndFormat('full');
    });

    describe('getStickyEndSequence', function() {
      it('getStartStickyEndSequence', function() {
        expect(startStickySequence.getStartStickyEndSequence().sequenceBases).toEqual('AT');
        expect(startStickySequence.getStartStickyEndSequence().isOnReverseStrand).toEqual(true);
        expect(endStickySequence.getStartStickyEndSequence().sequenceBases).toEqual('');
        expect(endStickySequence.getStartStickyEndSequence().isOnReverseStrand).toEqual(false);
      });

      it('getEndStickyEndSequence', function() {
        expect(startStickySequence.getEndStickyEndSequence().sequenceBases).toEqual('');
        expect(startStickySequence.getEndStickyEndSequence().isOnReverseStrand).toEqual(false);
        expect(endStickySequence.getEndStickyEndSequence().sequenceBases).toEqual('TA');
        expect(endStickySequence.getEndStickyEndSequence().isOnReverseStrand).toEqual(false);
      });
    });

    describe('overhang beyond stickyEnds integer values', function() {
      describe('overhangBeyondStartStickyEnd', function() {
        it('with start stickyEnds', function() {
          expect(startStickySequence.getStickyEnds(false).start.reverse).toEqual(true);

          expect(startStickySequence.overhangBeyondStartStickyEnd(3)).toEqual(1);
          expect(startStickySequence.overhangBeyondStartStickyEnd(4)).toEqual(0);
          expect(startStickySequence.overhangBeyondStartStickyEnd(1, true)).toEqual(1);
          expect(startStickySequence.overhangBeyondStartStickyEnd(2, true)).toEqual(0);
        });

        it('without start stickyEnds', function() {
          expect(endStickySequence.overhangBeyondStartStickyEnd(0)).toEqual(0);
          expect(endStickySequence.overhangBeyondStartStickyEnd(0, true)).toEqual(0);
        });
      });

      it('overhangBeyondEndStickyEnd', function() {
        it('with end stickyEnds', function() {
          expect(endStickySequence.getStickyEnds(false).end.reverse).toEqual(false);
          expect(endStickySequence.getLength()).toEqual(17);

          expect(endStickySequence.overhangBeyondEndStickyEnd(14)).toEqual(0);
          expect(endStickySequence.overhangBeyondEndStickyEnd(15)).toEqual(1);
          expect(endStickySequence.overhangBeyondEndStickyEnd(12, true)).toEqual(0);
          expect(endStickySequence.overhangBeyondEndStickyEnd(13, true)).toEqual(0);
        });

        it('without end stickyEnds', function() {
          expect(startStickySequence.getLength()).toEqual(15);

          expect(startStickySequence.overhangBeyondEndStickyEnd(14)).toEqual(0);
          expect(startStickySequence.overhangBeyondEndStickyEnd(14, true)).toEqual(0);
        });
      });

      describe('deleteStickyEnds', function() {
        it('should remove start stickyEnds', function() {
          var seqBefore = startStickySequence.getSequence(startStickySequence.STICKY_END_FULL);
          expect(seqBefore).toEqual('CCTACCCCCCCCCCC');

          startStickySequence.deleteStickyEnds();
          var seq = startStickySequence.getSequence(startStickySequence.STICKY_END_FULL);
          expect(seq).toEqual('CCCCCCCCCCC');
          expect(startStickySequence.getStickyEnds(false)).toEqual(undefined);
        });

        it('should remove end stickyEnds', function() {
          var seqBefore = endStickySequence.getSequence(endStickySequence.STICKY_END_FULL);
          expect(seqBefore).toEqual('CCCCCCCCCCCGGTACC');

          endStickySequence.deleteStickyEnds();
          var seq = endStickySequence.getSequence(endStickySequence.STICKY_END_FULL);
          expect(seq).toEqual('CCCCCCCCCCCGG');
          expect(endStickySequence.getStickyEnds(false)).toEqual(undefined);
        });

        it('should remove both stickyEnds', function() {
          var seqBefore = stickySequence.getSequence(endStickySequence.STICKY_END_FULL);
          expect(seqBefore).toEqual('GGGTACCGGGGGGGGGTAGG');

          stickySequence.deleteStickyEnds();
          var seq = stickySequence.getSequence(stickySequence.STICKY_END_FULL);
          expect(seq).toEqual('CCGGGGGGGGG');
          expect(stickySequence.getStickyEnds(false)).toEqual(undefined);
        });
      });
    });

    it('stickyEndConnects', function() {
      expect(startStickySequence.stickyEndConnects(endStickySequence)).toEqual(false);
      expect(endStickySequence.stickyEndConnects(startStickySequence)).toEqual(true);
    });
  }); //-describe('sticky end functions')


  describe('concatenateSequences', function() {
    it('concatenates endStickySequence, startStickySequence', function() {
      var concatenatedSequence = Sequence.concatenateSequences([endStickySequence, startStickySequence], false, false);
      expect(concatenatedSequence.getSequence()).toEqual('CCCCCCCCCCCGGTA' + 'CCCCCCCCCCC');
      var features = concatenatedSequence.getFeatures();
      expect(features.length).toEqual(3);
      expect(features[0].name).toEqual('endStickySequenceAnnotation');
      expect(features[0].ranges[0].from).toEqual(3);
      expect(features[0].ranges[0].to).toEqual(8);
      expect(features[1].name).toEqual('endStickySequenceEndAnnotation');
      expect(features[1].ranges[0].from).toEqual(11);
      expect(features[1].ranges[0].to).toEqual(14);
      expect(features[2].name).toEqual('startStickySequenceAnnotationShouldStay');
      expect(features[2].ranges[0].from).toEqual(13);
      expect(features[2].ranges[0].to).toEqual(13);
    });

    it('concatenates endStickySequence, stickySequence, startStickySequence', function() {
      var concatenatedSequence = Sequence.concatenateSequences([endStickySequence, stickySequence, startStickySequence], false, false);
      expect(concatenatedSequence.getSequence()).toEqual('CCCCCCCCCCCGGTA' + 'CCGGGGGGGGGTA' + 'CCCCCCCCCCC');
      var features = concatenatedSequence.getFeatures();
      expect(features.length).toEqual(4);
      expect(features[0].name).toEqual('endStickySequenceAnnotation');
      expect(features[0].ranges[0].from).toEqual(3);
      expect(features[0].ranges[0].to).toEqual(8);
      expect(features[1].name).toEqual('endStickySequenceEndAnnotation');
      expect(features[1].ranges[0].from).toEqual(11);
      expect(features[1].ranges[0].to).toEqual(14);
      expect(features[2].name).toEqual('startStickySequenceAnnotationShouldStay');
      expect(features[2].ranges[0].from).toEqual(26);
      expect(features[2].ranges[0].to).toEqual(26);
      expect(features[3].name).toEqual('stickySequenceAnnotation');
      expect(features[3].ranges[0].from).toEqual(27);
      expect(features[3].ranges[0].to).toEqual(27);
    });

    it('concatenates (and truncates features) endStickySequence, stickySequence, startStickySequence', function() {
      var concatenatedSequence = Sequence.concatenateSequences([endStickySequence, stickySequence, startStickySequence], false, true);
      concatenatedSequence.setStickyEndFormat('full');
      expect(concatenatedSequence.getSequence()).toEqual('CCCCCCCCCCCGGTA' + 'CCGGGGGGGGGTA' + 'CCCCCCCCCCC');
      var features = concatenatedSequence.getFeatures();
      expect(features.length).toEqual(7);
      expect(features[0].name).toEqual('endStickySequenceAnnotation');
      expect(features[0].ranges[0].from).toEqual(3);
      expect(features[0].ranges[0].to).toEqual(8);
      expect(features[1].name).toEqual('endStickySequenceEndAnnotation');
      expect(features[1].ranges[0].from).toEqual(11);
      expect(features[1].ranges[0].to).toEqual(14);
      expect(features[2].name).toEqual('startStickySequenceAnnotationShouldBeRemoved');
      expect(features[2].ranges[0].from).toEqual(26);
      expect(features[2].ranges[0].to).toEqual(26);
      expect(features[3].name).toEqual('startStickySequenceAnnotationShouldStay');
      expect(features[3].ranges[0].from).toEqual(26);
      expect(features[3].ranges[0].to).toEqual(26);
      expect(features[4].name).toEqual('stickySequenceAnnotation');
      expect(features[4].ranges[0].from).toEqual(27);
      expect(features[4].ranges[0].to).toEqual(27);
      expect(features[5].name).toEqual('stickySequenceAnnotationShouldBeRemoved');
      expect(features[5].ranges[0].from).toEqual(27);
      expect(features[5].ranges[0].to).toEqual(27);
      expect(features[6].name).toEqual('stickySequenceAnnotationShouldAlsoBeRemoved');
      expect(features[6].ranges[0].from).toEqual(27);
      expect(features[6].ranges[0].to).toEqual(27);
    });

    it('concatenates (and circularises) endStickySequence, stickySequence, startStickySequence', function() {
      var concatenatedSequence = Sequence.concatenateSequences([stickySequence, stickySequence], true, false);
      concatenatedSequence.setStickyEndFormat('full');
      expect(concatenatedSequence.getSequence()).toEqual('CCGGGGGGGGGTA' + 'CCGGGGGGGGGTA');
      expect(_.isEmpty(concatenatedSequence.getStickyEnds(false)));
      var features = concatenatedSequence.getFeatures();

      expect(features.length).toEqual(2);
      expect(features[0].name).toEqual('stickySequenceAnnotation');
      expect(features[0].ranges[0].from).toEqual(12);
      expect(features[0].ranges[0].to).toEqual(12);
      expect(features[1].name).toEqual('stickySequenceAnnotation');
      expect(features[1].ranges[0].from).toEqual(25);
      expect(features[1].ranges[0].to).toEqual(25);
    });

    it('errors concatenating incompatible sequences', function() {
      var error;
      try { 
        Sequence.concatenateSequences([endStickySequence, startStickySequence, startStickySequence], false);
      } catch (e) {
        error = e;
      }
      expect(error).toEqual('Can not concatenate sequences 2 and 2 as they have incompatible sticky ends: `` and `AT`');
    });

    it('errors concatenating and circularising incompatible sequences', function() {
      var error;
      try {
        Sequence.concatenateSequences([endStickySequence, startStickySequence], true);
      } catch (e) {
        error = e;
      }
      expect(error).toEqual('Can not concatenate sequences 2 and 1 as they have incompatible sticky ends: `` and ``');
    });
  });


  describe('#selectableRange', function() {
    describe('with full sticky end', function() {
      setStickyEndFormat('full');

      it('should return the boundaries of the entire sequence', function() {
        expect(stickyEndedSequence.selectableRange()).toEqual([0, 61]);
        expect(stickyEndedSequence.selectableRange(true)).toEqual([0, 61]);
      });
    });

    describe('with overhang sticky end formatting', function() {
      setStickyEndFormat('overhang');

      it('should return the boundaries of the sequence without the overhang', function() {
        expect(stickyEndedSequence.selectableRange()).toEqual([0, 19]);
        expect(stickyEndedSequence.selectableRange(true)).toEqual([4, 23]);
      });
    });

    describe('with no sticky end', function() {
      setStickyEndFormat('none');

      it('should return the boundaries of the sequence without the sticky end', function() {
        expect(stickyEndedSequence.selectableRange()).toEqual([0, 15]);
        expect(stickyEndedSequence.selectableRange(true)).toEqual([0, 15]);
      });
    });
  });


  describe('#editableRange', function() {
    describe('with full sticky ends showing', function() {
      setStickyEndFormat('full');

      it('should return the boundaries of the entire sequence', function() {
        var range = stickyEndedSequence.editableRange(true);
        expect(range.from).toEqual(0);
        // NOTE: remember range.to is exclusive so 62 is *not* included in range
        expect(range.to).toEqual(62);
      });

      it('should return the boundaries of the entire sequence plus 1 when not strict', function() {
        var range = stickyEndedSequence.editableRange();
        expect(range.from).toEqual(0);
        // What does this mean?  When is non-strict useful?
        expect(range.to).toEqual(63);
      });
    });

    describe('with overhang sticky end formatting', function() {
      setStickyEndFormat('overhang');

      it('should return the boundaries of the sequence without the sticky ends', function() {
        var range = stickyEndedSequence.editableRange(true);
        expect(range.from).toEqual(4);
        // NOTE: remember range.to is exclusive so 20 is *not* included in range
        expect(range.to).toEqual(20);
      });
    });

    describe('with no overhang sticky ends showing', function() {
      setStickyEndFormat('none');

      it('should return the boundaries of the sequence without the sticky ends', function() {
        var range = stickyEndedSequence.editableRange(true);
        expect(range.from).toEqual(0);
        // NOTE: remember range.to is exclusive so 16 is *not* included in range
        expect(range.to).toEqual(16);
      });
    });
  });


  describe('#isBaseEditable', function() {
    var basesShouldBeEditable = function(editableBases, strict) {
      editableBases.forEach(function(baseNumber) {
        it('should return true for editable base number ' + baseNumber, function() {
          expect(stickyEndedSequence.isBaseEditable(baseNumber, strict)).toEqual(true);
        });
      });
    };

    var basesShouldNotBeEditable = function(nonEditableBases, strict) {
      nonEditableBases.forEach(function(baseNumber) {
        it('should return false for editable base number ' + baseNumber, function() {
          expect(stickyEndedSequence.isBaseEditable(baseNumber, strict)).toEqual(false);
        });
      });
    };

    describe('in strict mode', function() {
      var strict = true;
      describe('with overhang sticky end formatting', function() {
        setStickyEndFormat('overhang');
        basesShouldBeEditable([4, 19], strict);
        basesShouldNotBeEditable([3, 20], strict);
      });

      describe('with full sticky end formatting', function() {
        setStickyEndFormat('full');
        basesShouldBeEditable([0, 61], strict);
        basesShouldNotBeEditable([-1, 62], strict);
      });
    });

    describe('in non-strict mode', function() {
      var strict = false;
      describe('with overhang sticky end formatting', function() {
        setStickyEndFormat('overhang');
        basesShouldBeEditable([4, 20], strict);
        basesShouldNotBeEditable([3, 21], strict);
      });

      describe('with full sticky end formatting', function() {
        setStickyEndFormat('full');
        basesShouldBeEditable([0, 62], strict);
        basesShouldNotBeEditable([-1, 63], strict);
      });
    });
  });


  describe('#ensureBaseIsEditable', function() {
    describe('with overhang sticky end formatting', function() {
      setStickyEndFormat('overhang');

      it('should get the correct sequence', function () {
        expect(stickyEndedSequence.getSequence()).toEqual('AGAG' + initialSequenceContent + 'GAGA');
      });

      describe('and without being strict', function() {
        it('should correct uneditable bases', function() {
          expect(stickyEndedSequence.ensureBaseIsEditable(4)).toEqual(4);
          expect(stickyEndedSequence.ensureBaseIsEditable(3)).toEqual(4);
          expect(stickyEndedSequence.ensureBaseIsEditable(20)).toEqual(20);
          expect(stickyEndedSequence.ensureBaseIsEditable(21)).toEqual(20);
        });
      });

      describe('and with being strict', function() {
        it('should correct uneditable bases', function() {
          expect(stickyEndedSequence.ensureBaseIsEditable(4, true)).toEqual(4);
          expect(stickyEndedSequence.ensureBaseIsEditable(3, true)).toEqual(4);
          expect(stickyEndedSequence.ensureBaseIsEditable(19, true)).toEqual(19);
          expect(stickyEndedSequence.ensureBaseIsEditable(20, true)).toEqual(19);
        });
      });
    });

    describe('with overhang sticky end formatting and no sequence length', function() {
      setStickyEndFormat('overhang');

      describe('and without being strict', function() {
        it('should correct uneditable bases', function() {
          expect(stickyEndedEmptySequence.ensureBaseIsEditable(4)).toEqual(4);
          expect(stickyEndedEmptySequence.ensureBaseIsEditable(3)).toEqual(4);
          expect(stickyEndedEmptySequence.ensureBaseIsEditable(5)).toEqual(4);
        });
      });

      describe('and with being strict', function() {
        it('should correct uneditable bases', function() {
          expect(stickyEndedEmptySequence.ensureBaseIsEditable(4, true)).toEqual(undefined);
          expect(stickyEndedEmptySequence.ensureBaseIsEditable(3, true)).toEqual(undefined);
          expect(stickyEndedEmptySequence.ensureBaseIsEditable(5, true)).toEqual(undefined);
        });
      });
    });

    describe('with an empty sequence', function() {
      setStickyEndFormat('overhang');

      describe('and without being strict', function() {
        it('should correct uneditable bases', function() {
          expect(emptySequence.ensureBaseIsEditable(0)).toEqual(0);
          expect(emptySequence.ensureBaseIsEditable(-1)).toEqual(0);
          expect(emptySequence.ensureBaseIsEditable(1)).toEqual(0);
        });
      });

      describe('and with being strict', function() {
        it('should correct uneditable bases', function() {
          // TODO: should these throw exceptions?... we're trying to get the
          // "stict" editable range for an empty sequence.
          expect(emptySequence.ensureBaseIsEditable(0, true)).toEqual(undefined);
          expect(emptySequence.ensureBaseIsEditable(-1, true)).toEqual(undefined);
          expect(emptySequence.ensureBaseIsEditable(1, true)).toEqual(undefined);
        });
      });
    });
  });


  describe('#isRangeEditable', function() {
    var rangesShouldBeEditable = function(ranges) {
      ranges.forEach(function(range) {
        it('should return true for editable range ' + JSON.stringify(range), function() {
          expect(stickyEndedSequence.isRangeEditable(...range)).toEqual(true);
        });
      });
    };

    var rangesShouldNotBeEditable = function(ranges) {
      ranges.forEach(function(range) {
        it('should return false for non editable range ' + JSON.stringify(range), function() {
          expect(stickyEndedSequence.isRangeEditable(...range)).toEqual(false);
        });
      });
    };

    var nonEditableRanges = [
      [3, 6],
      [18, 21],
    ];

    var editableRanges = [
      [4, 6],
      [18, 20]
    ];

    describe('with full sticky end formatting', function() {
      setStickyEndFormat('full');
      rangesShouldBeEditable(editableRanges.concat(nonEditableRanges));
    });

    describe('with overhang sticky end formatting', function() {
      setStickyEndFormat('overhang');
      rangesShouldBeEditable(editableRanges);
      rangesShouldNotBeEditable(nonEditableRanges);
    });

    describe('with none sticky end formatting', function() {
      setStickyEndFormat('none');
      rangesShouldBeEditable([[0, 2], [14, 16]]);
      rangesShouldNotBeEditable([[-1, 2], [14, 17]]);
    });
  });

}
