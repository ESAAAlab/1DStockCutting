var stockCutting = angular.module('stockCutting',['ngMaterial','ngStorage','ngFileUpload','pascalprecht.translate']);

stockCutting.config(['$mdThemingProvider','$translateProvider',function($mdThemingProvider,$translateProvider) {
  
  $mdThemingProvider.definePalette('customPalette', {
    '50': '#858585',
    '100': '#5e5e5e',
    '200': '#424242',
    '300': '#1f1f1f',
    '400': '#0f0f0f',
    '500': '#000000',
    '600': '#000000',
    '700': '#000000',
    '800': '#000000',
    '900': '#000000',
    'A100': '#858585',
    'A200': '#5e5e5e',
    'A400': '#0f0f0f',
    'A700': '#000000',
    'contrastDefaultColor': 'light',
    'contrastDarkColors': '50 A100'
  });
  $mdThemingProvider.theme('default').primaryPalette('customPalette').accentPalette('green');

  $translateProvider.translations('en', {
    TITLE: '1D Stock Cutting',
    TITLE_UPLOAD_ARIA: 'Load saved project from disk',
    TITLE_DOWNLOAD_ARIA: 'Save project to disk',

    FORM_NAME: 'Project Name',
    FORM_UNITS: 'Units',
    FORM_STOCK: 'Stock Length',
    FORM_CUT: 'Cut Width',
    FORM_ALGORITHM: 'Algorithm',
    FORM_BUTTON_ADD: 'ADD PART',
    FORM_ADD_ARIA: 'Add Part',
    FORM_PART_LENGTH: 'Length',
    FORM_PART_QTT : 'Quantity',
    FORM_PART_REMOVE_ARIA: 'Remove part',

    RESULT_TITLE: 'Cut List',
    RESULT_PRINT_ARIA: 'Print Cut List',
    RESULT_INVENTORY: 'Inventory',
    RESULT_STOCK_NEEDED: 'Stock Needed',
    RESULT_TOTAL_LENGTH: 'Total Length',
    RESULT_WASTE: 'Waste',

    RESULT_CUT_LIST: 'Cut List',
    RESULT_STOCK_PREFIX: 'Stock ',
  });
  $translateProvider.translations('fr', {
    TITLE: 'Calepinage 1D',
    TITLE_UPLOAD_ARIA: 'Charger un project sauvegardé',
    TITLE_DOWNLOAD_ARIA: 'Sauvegarder le projet',
    FORM_NAME: 'Nom du projet',
    FORM_UNITS: 'Unités',
    FORM_STOCK: 'Longueur du brut',
    FORM_CUT: 'Largeur de coupe',
    FORM_ALGORITHM: 'Algorithme',
    FORM_BUTTON_ADD: 'AJOUTER UNE PIECE',
    FORM_ADD_ARIA: 'Ajouter une pièce',
    FORM_PART_LENGTH: 'Longueur',
    FORM_PART_QTT : 'Quantité',
    FORM_PART_REMOVE_ARIA: 'Supprimer la pièce',

    RESULT_TITLE: 'Liste de découpe',
    RESULT_PRINT_ARIA: 'Imprimer la liste de découpe', 
    RESULT_INVENTORY: 'Inventaire',
    RESULT_STOCK_NEEDED: 'Stock nécessaire',
    RESULT_TOTAL_LENGTH: 'Longueur totale',
    RESULT_WASTE: 'Déchets',

    RESULT_CUT_LIST: 'Liste de découpe',
    RESULT_STOCK_PREFIX: 'Stock ',
  });
  $translateProvider
    .registerAvailableLanguageKeys(['en', 'fr'], {
         'en*': 'en',
         'fr*': 'fr',
     })
    .determinePreferredLanguage()
    .fallbackLanguage('en')
    .useSanitizeValueStrategy('escape');
}]);

stockCutting.directive('onFinishRender',['$timeout', function ($timeout) {
  return {
    restrict: 'A',
      link: function (scope, element, attr) {
        if (scope.$last === true) {
          $timeout(function () {
            scope.$emit(attr.onFinishRender);
          });
        }
      }
  };
}]);

stockCutting.controller('1DCtrl', ['$scope','$localStorage','$window','$timeout', 'Upload', function($scope, $localStorage, $window, $timeout, $upload) {
  $scope.algorithms = [
    {method:"next_fit", name:'Next Fit'},
    {method:"first_fit", name:'First Fit'},
    {method:"best_fit", name:'Best Fit'},
    {method:"worst_fit", name:'Worst Fit'},
    {method:"best_fit_decreasing", name:'Best Fit Decreasing'},
    {method:"worst_fit_decreasing", name:'Worst Fit Decreasing'}
  ];

  $scope.units = [
    'mm',
    'cm',
    'm',
    'in',
    'ft'
  ];

  $scope.project = $localStorage.$default({
    name:'Default Project',
    alg:4,
    cutSize: 10,
    parts: [
      {size:1560, quantity:3},
      {size:610, quantity:4},
      {size:520, quantity:2},
      {size:700, quantity:2},
      {size:180, quantity:10},
    ],
    stockLength:3000,
    units:'mm'
  });

  $scope.cutList = {};

  $scope.changeLanguage = function (key) {
    $translate.use(key);
  };

  $scope.pack1D = function(method, cutSize, parts, stockLength) {
    var items = [];
    for (var i = 0;i<parts.length;i++) {
      if (parts[i].size !== undefined) {
        for (var j = 0;j < parts[i].quantity; j++) {
          items.push(parts[i].size+cutSize);
        }
      }          
    }
    var bins = new Array(items.length);
    var fn = window[method];
    var binsUsed;
    if (typeof fn === "function") {
      binsUsed = fn.apply(null, [stockLength, items, bins]);
    }
    var result = {};
    result.binsUsed = binsUsed;
    result.items = [];
    result.cutSize = cutSize;
    result.stockLength = stockLength;
    for (i = 0;i<items.length;i++) {
      result.items.push({length: items[i],bin: bins[i]});
    }
    result.items.sort(function (a, b) {
      if (a.bin > b.bin)
        return 1;
      if (a.bin < b.bin)
        return -1;
      return 0;
    });
    for (i = 0;i<items.length;i++) {
      items[i] = items[i]-cutSize;
    }
    $scope.createCutList(result);
  };

  $scope.createCutList = function(source) {
    var fillColors = [
      'rgba(54, 162, 235, 0.4)',
      'rgba(255, 206, 86, 0.4)',
      'rgba(75, 192, 192, 0.4)',
      'rgba(153, 102, 255, 0.4)',
      'rgba(255, 159, 64, 0.4)'
    ];

    var strokeColors = [
      'rgb(54, 162, 235)',
      'rgb(255, 206, 86)',
      'rgb(75, 192, 192)',
      'rgb(153, 102, 255)',
      'rgb(255, 159, 64)'
    ];

    var barFillColor = 'rgba(80,80,80,0.1)';
    var barStrokeColor = 'rgba(50,50,50)';

    var totalLength = 0;

    $scope.cutList = {
      nbStock:source.binsUsed,
      cutSize: source.cutSize,
      stockLength: source.stockLength,
      totalStockLength: source.binsUsed*source.stockLength,
      fillColor: barFillColor,
      strokeColor: barStrokeColor,
      bins: new Array(source.binsUsed)
    };

    var colors = [];
    for (var i in source.items) {
      var item = source.items[i];
      if (colors.indexOf(item.length-source.cutSize) == -1) {
        colors.push(item.length-source.cutSize);
      }
    }

    for (i in source.items) {
      totalLength += source.items[i].length-source.cutSize;
      if ($scope.cutList.bins[source.items[i].bin] === undefined) {
        $scope.cutList.bins[source.items[i].bin] = [];
      }

      var part = {
        length: source.items[i].length-source.cutSize,
        label: (source.items[i].bin+1)+"."+($scope.cutList.bins[source.items[i].bin].length+1),
        fillColor: fillColors[colors.indexOf(source.items[i].length-source.cutSize)%fillColors.length],
        strokeColor: strokeColors[colors.indexOf(source.items[i].length-source.cutSize)%strokeColors.length]
      };
      $scope.cutList.bins[source.items[i].bin].push(part);
    }

    for (i in $scope.cutList.bins) {
      $scope.cutList.bins[i].sort(function (a, b) {
        if (a.length < b.length)
          return 1;
        if (a.length > b.length)
          return -1;
        return 0;
      });
    }

    for (var bin in $scope.cutList.bins) {
      var obj = { };
      var arr = $scope.cutList.bins[bin];
      
      for (i = 0, j = arr.length; i < j; i++) {
         obj[arr[i].length] = (obj[arr[i].length] || 0) + 1;
      }
      $scope.cutList.bins[bin].parts = obj;
      var partsString = "";
      for (var p = Object.keys(obj).length-1; p >= 0; p--) {
        partsString += obj[Object.keys(obj)[p]]+" x "+Object.keys(obj)[p]+""+$scope.project.units;
        if (p !== 0) {
          partsString += " + ";
        }
      }
      $scope.cutList.bins[bin].description = partsString;
    }
    $scope.cutList.totalLength = totalLength;
    $scope.cutList.waste = source.binsUsed*source.stockLength-totalLength;
  };

  $scope.removePart = function(id) {
    $scope.project.parts.splice(id,1);
    $scope.submit();
  };

  $scope.addPart = function() {
    $scope.project.parts.push({size:$scope.project.stockLength, quantity:1});
    $scope.submit();
  };

  $scope.submit = function () {
    $scope.pack1D($scope.algorithms[$scope.project.alg].method,$scope.project.cutSize,$scope.project.parts,$scope.project.stockLength);
  };

  $scope.downloadProject = function() {
    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify($scope.project));
    var dlAnchorElem = document.getElementById('downloadAnchorElem');
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", $scope.project.name+".json");
    dlAnchorElem.click();
  };

  $scope.uploadProject = function(file, errFiles) {
    $scope.f = file;
    $scope.errFile = errFiles && errFiles[0];
    if (file) {
      file.upload = $upload.upload({
        url: 'https://angular-file-upload-cors-srv.appspot.com/upload',
        data: {file: file}
      });

      file.upload.then(function (response) {
        $timeout(function () {
          file.result = response.data;
          var reader = new FileReader();
          reader.addEventListener('load', function() {
            $scope.$apply(function() {
              var loadedJSON = JSON.parse(reader.result);
              for (var i in Object.keys(loadedJSON)) {
                $scope.project[Object.keys(loadedJSON)[i]] = loadedJSON[Object.keys(loadedJSON)[i]];
              }
              $scope.submit();
            });
          });
          reader.readAsText(file,'UTF-8');          
        });
      }, function (response) {
        if (response.status > 0)
          $scope.errorMsg = response.status + ': ' + response.data;
      }, function (evt) {
        file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
      });
    }   
  };

  $scope.save = function() {
    $localStorage.message = $scope.project;
  };

  $scope.drawBars = function(width) {
    for (var i in $scope.cutList.bins) {
      var bin = $scope.cutList.bins[i];
      var draw = SVG('drawing-'+i).size(width,35);
      draw.rect('100%',35).fill({color:'#FFF'});
      var el = document.getElementById('drawing-'+i);
      var rect = el.getBoundingClientRect();
      draw.rect('100%',35).fill({color:$scope.cutList.fillColor}).stroke({color:$scope.cutList.strokeColor});
      var xOffset = 0;
      var scaleRatio = rect.width/$scope.cutList.stockLength;
      for (var j = 0; j < bin.length;j++) {
        draw
          .rect(bin[j].length*scaleRatio,35)
          .fill({ color: bin[j].fillColor})
          .stroke({ color: bin[j].strokeColor})
          .translate(xOffset*scaleRatio,0);
        draw
          .text(bin[j].length+"")
          .font({
            family:   'Helvetica',
            size:     12,
            anchor:   'middle',
            leading: '1.8em'
          })
          .fill({color:'rgba(0,0,0,0.5)'})
          .translate((xOffset+bin[j].length/2)*scaleRatio,0);
        xOffset += bin[j].length+$scope.cutList.cutSize;
      }
    }
  };

  $scope.print = function() {
    $scope.drawBars(210-30+'mm');
    window.print();
  };

  var w = angular.element($window);
  
  w.onbeforprint = function() {
    console.log("GOING TO PRINT");
  };

  w.bind('resize', function () {
    $scope.$emit('ngRepeatFinished');
  });

  $scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent) {
    $scope.drawBars('100%');
  });

  $scope.submit();
}]);